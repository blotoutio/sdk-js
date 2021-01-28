import { constants } from '../common/config'
import { getVariable } from '../manifest'
import { getMid, getSystemMergeCounter } from '../common/utils'
import { stringToIntSum } from '../common/securityUtil'
import {
  getNormalUseValue,
  setNormalUseValue,
} from '../storage/sharedPreferences'
import { updateRoot } from '../storage/store'
import { getStringDate } from '../common/timeUtil'
import { getSessionForDate } from './session'
import { getSession } from '../storage'
import { getPayload } from '../common/payloadUtil'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getUID } from '../common/uuidUtil'
import { getReferrer } from '../common/referrerUtil'

const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export const eventsChunkArr = (events, devEvents) => {
  let codifiedMergeCounter = getVariable(constants.EVENT_CODIFIED_MERGECOUNTER)
  if (codifiedMergeCounter == null) {
    codifiedMergeCounter = constants.DEFAULT_EVENT_CODIFIED_MERGECOUNTER
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)
  const sysEvents =
    sysMergeCounterValue != null ? chunk(events, sysMergeCounterValue) : []
  const codifiedEvents = chunk(devEvents, codifiedMergeCounter)

  const length =
    sysEvents.length > codifiedEvents.length
      ? sysEvents.length
      : codifiedEvents.length
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

export const createDevEventInfoObj = (
  eventName,
  objectName,
  data = null,
  eventCode = null
) => {
  const event = {
    sentToServer: false,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    evcs: eventCode || codeForCustomCodifiedEvent(eventName),
  }

  if (eventName) {
    event.name = eventName
  }

  if (objectName) {
    event.objectName = objectName
  }

  if (data) {
    event.metaInfo = data
  }

  return event
}

export const eventSync = {
  inProgress: false,
  set progressStatus(status) {
    this.inProgress = status
  },
  get progressStatus() {
    return this.inProgress
  },
}

export const shouldCollectSystemEvents = () => {
  let collect = getVariable(constants.PUSH_SYSTEM_EVENTS)
  if (collect == null || collect === '0') {
    collect = constants.DEFAULT_PUSH_SYSTEM_EVENTS
  }

  return collect
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

  const customEventStore =
    getNormalUseValue(constants.CUSTOM_EVENT_STORAGE) || {}
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
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return null
  }

  const viewportLength = (session.viewPort || []).length
  const viewPortObj =
    viewportLength > 0 ? session.viewPort[viewportLength - 1] : null

  const result = []
  arr.forEach((val) => {
    if (val.evn) {
      result.push(val)
      return
    }
    const propObj = {
      referrer: getReferrer(),
      obj: val.objectName,
      position: val.position,
      session_id: sessionId,
    }

    if (viewPortObj) {
      propObj.screen = viewPortObj
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
        propObj.mouse = {
          x: val.extraInfo.mousePosX,
          y: val.extraInfo.mousePosY,
        }
      }
    }

    if (val.metaInfo) {
      propObj.codifiedInfo = val.metaInfo
    }

    const obj = {
      mid: val.mid,
      userid: getUID(),
      evn: val.name,
      evcs: val.evcs,
      scrn: val.urlPath,
      evt: val.tstmp,
      properties: propObj,
    }

    result.push(obj)
  })
  return result
}

export const sendEvents = (arr) => {
  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }
  const eventsArr = getEventPayloadArr(arr, date, sessionId)
  if (eventsArr.length === 0) {
    return
  }

  const payload = getPayload(session, eventsArr)
  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => {})
    .catch(error)
}
