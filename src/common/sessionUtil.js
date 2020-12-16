import { postRequest } from './networkUtil'
import {
  constants,
  isSysEvtStore,
  isDevEvtStore,
  isHighFreqEventOff,
  highFreqEvents,
  isSysEvtCollect,
  isApprox,
  systemEventCode
} from '../config'
import * as log from './logUtil'
import {
  getDate,
  createDevEventInfoObj,
  checkEventPushEventCounter,
  syncEvents,
  isEventExist,
  findObjIndex,
  getSelector,
  setNewDateObject,
  createEventInfoObj,
  getPreviousDate,
  createRefEventInfoObj,
  sendPIIPHIEvent,
  getEventPayloadArr,
  createViewPortObject,
  setEventsSentToServer,
  sendNavigation,
  getNotSyncedEvents,
  eventsChunkArr,
  getPayload,
  getReferrerUrlOfDateSession,
  getMid,
  getSystemMergeCounter
} from '../utils'
import { getManifestUrl } from './endPointUrlUtil'
import { getNearestTimestamp } from './timeUtil'
import { getSession, setSession } from '../storage'
import { getEventsByDate, getStore as getEventsStore, setEventsByDate } from '../storage/event'
import { updateStore } from '../storage/store'
import { getTempUseValue } from '../storage/sharedPreferences'

const sumFunction = (total, num) => {
  return total + num
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

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
    // To calculate navigation time
    setSession(constants.SESSION_START_TIME, sessionId)
  }

  return sessionId
}

export const setDevEvent = (eventName, objectName, meta) => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const obj = createDevEventInfoObj(eventName, objectName, meta, false, false)

  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(obj)

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const setStartDevEvent = (eventName, objectName, meta) => {
  let eventArray = JSON.parse(getSession('startEvents')) || []
  const isExist = isEventExist(eventArray, eventName)
  if (!isExist) {
    eventArray.push(
      createDevEventInfoObj(eventName, objectName, meta, false, false))
    eventArray = JSON.stringify(eventArray)
  } else {
    const index = findObjIndex(eventArray, eventName)
    eventArray[index].startTime = Date.now()
    eventArray = JSON.stringify(eventArray)
  }
  setSession('startEvents', eventArray)
}

export const setEndDevEvent = (eventName) => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  let eventArray = JSON.parse(getSession('startEvents')) || []
  const isExist = isEventExist(eventArray, eventName)
  if (!isExist) {
    log.error('Event did not start yet')
    return
  }

  const index = findObjIndex(eventArray, eventName)
  const eventObject = eventArray[index]
  const diffTime = Date.now() - eventObject.tstmp
  eventObject.duration = Math.floor(diffTime / 1000)

  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(eventObject)

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkDataForDate)
  updateStore()

  if (eventArray.length === 0) {
    return
  }

  eventArray.splice(index, 1)
  eventArray = JSON.stringify(eventArray)
  setSession('startEvents', eventArray)
}

export const setEvent = function (eventName, event, meta = {}) {
  if (isHighFreqEventOff && highFreqEvents.includes(eventName)) {
    return
  }

  try {
    const objectName = getSelector(event.target)
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const eventStore = getEventsStore()

    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
      return
    }

    const sdkDataForDate = getEventsByDate(date)
    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsByDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const updatePreviousDayEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getPreviousDate()

  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const setReferrerEvent = (eventName, ref, meta) => {
  try {
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsByDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(createRefEventInfoObj(eventName, ref, meta))
    setEventsByDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const setDNTEvent = function (eventName, event, meta) {
  try {
    const objectName = getSelector(event.target)
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsByDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsByDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const updateSessionEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)

  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const updateNavPath = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  const navPaths = sdkDataForDate.sessions[sessionId].eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  const lastPath = navPaths[navPaths.length - 1]
  if (window.location.href !== lastPath) {
    sdkDataForDate.sessions[sessionId].eventsData.navigationPath.push(window.location.href)
  }
  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const updateNavTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  const startTime = parseInt(getSession(constants.SESSION_START_TIME))
  const timeArray = sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav
  const currentTime = Date.now()
  const navPaths = sdkDataForDate.sessions[sessionId].eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  if (window.location.href !== navPaths[navPaths.length - 1]) {
    let diffTime
    if (timeArray.length > 0) {
      const totalLogTime = timeArray.reduce(sumFunction)
      const totalTimeInMilli = totalLogTime * 1000
      const totalTime = startTime + totalTimeInMilli
      diffTime = currentTime - totalTime
    } else {
      diffTime = currentTime - startTime
    }

    const diffTimeInSecs = Math.floor(diffTime / 1000)
    sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.push(diffTimeInSecs)
    setEventsByDate(date, sdkDataForDate)
    updateStore()
    return
  }

  let totalLogTime = 0
  if (timeArray.length > 1) {
    totalLogTime = timeArray.reduce(sumFunction)
  }
  const totalTimeInMilli = totalLogTime * 1000
  const totalTime = startTime + totalTimeInMilli
  const diffTime = currentTime - totalTime
  const diffTimeInSecs = Math.floor(diffTime / 1000)
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.pop()
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.push(diffTimeInSecs)

  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const syncPreviousSessionEvents = () => {
  if (!isSysEvtStore && !isDevEvtStore) {
    return
  }

  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)
  const currentSessionId = getSession(constants.SESSION_ID)
  if (currentSessionId === sessionId) {
    return
  }
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkDataForDate.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, date, 'pii')
  sendPIIPHIEvent(phiEvents, date, 'phi')

  let eventsArrayChunk = eventsChunkArr(events, devEvents)
  eventsArrayChunk = addSessionInfoEvent(events, eventsArrayChunk, date, sessionId)
  sendNavigation(date, sessionId)
  eventsArrayChunk.forEach((array) => {
    const eventsArray = getEventPayloadArr(array, date, sessionId)
    if (eventsArray.length === 0) {
      return
    }

    const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArray)
    const url = getManifestUrl()
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(array, date, sessionId)
      })
      .catch(log.error)
  })
}

export const getNotSyncedSession = (object) => {
  let lastSyncSession
  for (const x in object) {
    lastSyncSession = x
    if (!object[x].eventsData.sentToServer) {
      break
    }
  }
  return lastSyncSession
}

export const setViewPort = function () {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const obj = createViewPortObject()
  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].viewPort.push(obj)
  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const setSessionPIIEvent = function (eventName, objectName, meta) {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(
    createDevEventInfoObj(eventName, objectName, meta, true, false))

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const setSessionPHIEvent = function (eventName, objectName, meta) {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(
    createDevEventInfoObj(eventName, objectName, meta, false, true))

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkDataForDate)
  updateStore()
}

export const addSessionInfoEvent = function (events, eventsArrayChunk, date, sessionId) {
  if (!isSysEvtCollect) {
    return eventsArrayChunk
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)

  const sessionInfoObj = getSessionInfoPayload(date, sessionId)
  const chunkIndex = eventsArrayChunk.findIndex((arr) => arr.length < sysMergeCounterValue)
  if (chunkIndex === -1) {
    const sessionEvtArr = [sessionInfoObj]
    eventsArrayChunk.push(sessionEvtArr)
  } else {
    eventsArrayChunk[chunkIndex].push(sessionInfoObj)
  }
  return eventsArrayChunk
}

export const getSessionInfoPayload = (date, sessionId) => {
  const sdkDataForDate = getEventsByDate(date)
  const viewportLen = sdkDataForDate.sessions[sessionId].viewPort.length
  const viewPortObj = sdkDataForDate.sessions[sessionId].viewPort[viewportLen - 1]
  const eventTime = isApprox ? getNearestTimestamp(Date.now()) : Date.now()
  const startTime = sdkDataForDate.sessions[sessionId].startTime
  const endTime = sdkDataForDate.sessions[sessionId].endTime
  const durationInSecs = Math.floor((endTime - startTime) / 1000)
  const propObj = {
    referrer: getReferrerUrlOfDateSession(date, sessionId),
    screen: viewPortObj,
    session_id: sessionId,
    start: startTime,
    end: endTime,
    duration: durationInSecs
  }

  const obj = {
    mid: getMid(),
    userid: getTempUseValue(constants.UID),
    evn: constants.SESSION_INFO,
    evcs: systemEventCode.sessionInfo,
    evdc: 1,
    scrn: window.location.href,
    evt: eventTime,
    properties: propObj,
    nmo: 1,
    evc: constants.EVENT_CATEGORY
  }

  return obj
}
