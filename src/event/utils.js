import { constants, isSysEvtCollect } from '../config'
import { getManifestVariable } from '../manifest'
import { getMid, getSystemMergeCounter, shouldApproximateTimestamp } from '../utils'
import { stringToIntSum } from '../common/securityUtil'
import { getNormalUseValue, getTempUseValue, setNormalUseValue } from '../storage/sharedPreferences'
import { updateRoot } from '../storage/store'
import { getAllEventsOfDate } from './index'
import { getEventsByDate } from './storage'
import { getReferrerUrlOfDateSession } from '../common/referrerUtil'
import { getNearestTimestamp } from '../common/timeUtil'

const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export const eventsChunkArr = (events, devEvents) => {
  let codifiedMergeCounter = getManifestVariable(constants.EVENT_CODIFIED_MERGECOUNTER)
  if (codifiedMergeCounter == null) {
    codifiedMergeCounter = constants.DEFAULT_EVENT_CODIFIED_MERGECOUNTER
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)
  const sysEvents = sysMergeCounterValue != null ? chunk(events, sysMergeCounterValue) : []
  const codifiedEvents = chunk(devEvents, codifiedMergeCounter)

  const length = sysEvents.length > codifiedEvents.length ? sysEvents.length : codifiedEvents.length
  const mergeArr = []
  for (let i = 0; i < length; i++) {
    let inArr = []
    if (sysEvents[i]) {
      inArr = inArr.concat(sysEvents[i])
    }
    if (codifiedEvents[i]) {
      inArr = inArr.concat(codifiedEvents[i])
    }
    mergeArr.push(inArr)
  }
  return mergeArr
}

export const createDevEventInfoObj = (eventName, objectName, meta, isPii, isPhi, duration = null) => {
  return {
    sentToServer: false,
    objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_DEV_CATEGORY,
    evcs: codeForCustomCodifiedEvent(eventName),
    duration,
    metaInfo: meta,
    isPii,
    isPhi
  }
}

export const eventSync = {
  inProgress: false,
  set progressStatus (status) {
    this.inProgress = status
  },
  get progressStatus () {
    return this.inProgress
  }
}

export const shouldCollectSystemEvents = () => {
  return isSysEvtCollect
}

const checkIfCodeExists = (eventName) => {
  const customEventStore = getNormalUseValue(constants.CUSTOM_EVENT_STORAGE)
  if (customEventStore) {
    const valueFoundIsEventCode = customEventStore[eventName]
    if (valueFoundIsEventCode) {
      return valueFoundIsEventCode
    }
  }

  return 0
}

const generateSubCode = (eventSum) => {
  return constants.DEVELOPER_EVENT_CUSTOM + (eventSum % 8899)
}

export const codeForCustomCodifiedEvent = (eventName) => {
  if (!eventName) {
    return 0
  }

  let eventSubCode = checkIfCodeExists(eventName)
  if (eventSubCode !== 0) {
    return eventSubCode
  }

  let eventNameIntSum = stringToIntSum(eventName)
  eventSubCode = generateSubCode(eventNameIntSum)

  const customEventStore = getNormalUseValue(constants.CUSTOM_EVENT_STORAGE) || {}
  const keys = Object.keys(customEventStore)
  for (let i = 0; i < keys.length; i++) {
    const valAsEventName = keys[i]
    if (customEventStore[valAsEventName] === eventSubCode) {
      eventNameIntSum += 1
      eventSubCode = generateSubCode(eventNameIntSum)
      i = 0 // re-looping again to check new code
    }
  }

  customEventStore[eventName] = eventSubCode
  setNormalUseValue(constants.CUSTOM_EVENT_STORAGE, customEventStore)

  updateRoot()
  return eventSubCode
}

export const getEventPayloadArr = (arr, date, sessionId) => {
  const dateEvents = getAllEventsOfDate(date)
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return null
  }
  const session = sdkData.sessions[sessionId]
  const viewportLength = (session.viewPort || []).length
  const viewPortObj = viewportLength > 0 ? session.viewPort[viewportLength - 1] : {}

  const result = []
  arr.forEach((val) => {
    if (val.evn) {
      result.push(val)
      return
    }
    const propObj = {
      referrer: getReferrerUrlOfDateSession(date, sessionId),
      screen: viewPortObj,
      obj: val.objectName,
      position: val.position,
      session_id: sessionId
    }

    if (val.objectTitle) {
      propObj.objT = val.objectTitle
    }

    if (
      val.name === 'click' ||
      val.name === 'mouseover' ||
      val.name === 'hoverc' ||
      val.name === 'hover' ||
      val.name === 'dblclick'
    ) {
      if (val.extraInfo) {
        propObj.mouse = { x: val.extraInfo.mousePosX, y: val.extraInfo.mousePosY }
      }
    }

    if (val.evc === constants.EVENT_DEV_CATEGORY) {
      propObj.codifiedInfo = val.metaInfo
    }

    const eventTime = shouldApproximateTimestamp() ? getNearestTimestamp(val.tstmp) : val.tstmp
    const eventCount = dateEvents.filter((evt) => evt.name === val.name)
    const obj = {
      mid: val.mid,
      userid: getTempUseValue(constants.UID),
      evn: val.name,
      evcs: val.evcs,
      evdc: eventCount.length,
      scrn: val.urlPath,
      evt: eventTime,
      properties: propObj,
      nmo: val.nmo,
      evc: val.evc
    }

    result.push(obj)
  })
  return result
}

export const getNavigationTime = (sessionId, date) => {
  const sdkDataForDate = getEventsByDate(date)
  if (!sdkDataForDate || !sdkDataForDate.sessions || !sdkDataForDate.sessions[sessionId] || !sdkDataForDate.sessions[sessionId].eventsData) {
    return
  }
  const eventsData = sdkDataForDate.sessions[sessionId].eventsData
  const sesssionStartTime = sdkDataForDate.sessions[sessionId].startTime
  const navigationsTime = eventsData.stayTimeBeforeNav

  if (!navigationsTime || navigationsTime.length === 0) {
    return
  }

  return navigationsTime.map((val, index) => {
    if (index === 0) {
      return Math.ceil((val - sesssionStartTime) / 1000)
    }
    return Math.ceil((val - navigationsTime[index - 1]) / 1000)
  })
}
