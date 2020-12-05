import { postRequest } from './networkUtil'
import {
  constants,
  manifestConst,
  isSysEvtStore,
  isDevEvtStore,
  isHighFreqEventOff,
  highFreqEvents
} from '../config'
import * as log from './logUtil'
import {
  updateStore,
  getSessionData,
  setSessionData,
  getEventsStore,
  getEventsSDKDataForDate,
  setEventsSDKDataForDate
} from './storageUtil'
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
  getPayload
} from '../utils'
import { getManifestUrl } from './endPointUrlUtil'

const sumFunction = (total, num) => {
  return total + num
}

export const checkAndGetSessionId = () => {
  let sessionId = getSessionData(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSessionData(constants.SESSION_ID, sessionId)
    // To calculate navigation time
    setSessionData(constants.SESSION_START_TIME, sessionId)
  }

  return sessionId
}

export const setDevEvent = (eventName, objectName, meta) => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const obj = createDevEventInfoObj(eventName, objectName, meta, false, false)

  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(obj)

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush) {
    syncEvents()
  }

  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const setStartDevEvent = (eventName, objectName, meta) => {
  let eventArray = JSON.parse(getSessionData('startEvents')) || []
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
  setSessionData('startEvents', eventArray)
}

export const setEndDevEvent = (eventName) => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  let eventArray = JSON.parse(getSessionData('startEvents')) || []
  const isExist = isEventExist(eventArray, eventName)
  if (!isExist) {
    log.error('Event did not start yet')
    return
  }

  const index = findObjIndex(eventArray, eventName)
  const eventObject = eventArray[index]
  const diffTime = Date.now() - eventObject.tstmp
  eventObject.duration = Math.floor(diffTime / 1000)

  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(eventObject)

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush) {
    syncEvents()
  }

  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()

  if (eventArray.length === 0) {
    return
  }

  eventArray.splice(index, 1)
  eventArray = JSON.stringify(eventArray)
  setSessionData('startEvents', eventArray)
}

export const setEvent = function (eventName, event, meta = {}) {
  if (isHighFreqEventOff && highFreqEvents.includes(eventName)) {
    return
  }

  try {
    const objectName = getSelector(event.target)
    const sessionId = getSessionData(constants.SESSION_ID)
    const date = getDate()
    const eventStore = getEventsStore()

    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
      return
    }

    const sdkDataForDate = getEventsSDKDataForDate(date)
    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsSDKDataForDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const updatePreviousDayEndTime = () => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getPreviousDate()

  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const setReferrerEvent = (eventName, ref, meta) => {
  try {
    const sessionId = getSessionData(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsSDKDataForDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(createRefEventInfoObj(eventName, ref, meta))
    setEventsSDKDataForDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const setDNTEvent = function (eventName, event, meta) {
  try {
    const objectName = getSelector(event.target)
    const sessionId = getSessionData(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsSDKDataForDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsSDKDataForDate(date, sdkDataForDate)
    updateStore()
  } catch (error) {
    log.info(error)
  }
}

export const updateSessionEndTime = () => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)

  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const updateNavPath = () => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  const navPaths = sdkDataForDate.sessions[sessionId].eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  const lastPath = navPaths[navPaths.length - 1]
  if (window.location.href !== lastPath) {
    sdkDataForDate.sessions[sessionId].eventsData.navigationPath.push(window.location.href)
  }
  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const updateNavTime = () => {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  const startTime = parseInt(getSessionData(constants.SESSION_START_TIME))
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
    setEventsSDKDataForDate(date, sdkDataForDate)
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

  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const syncPreviousSessionEvents = () => {
  if (!isSysEvtStore && !isDevEvtStore) {
    return
  }

  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)
  const currentSessionId = getSessionData(constants.SESSION_ID)
  if (currentSessionId === sessionId) {
    return
  }
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkDataForDate.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, date, 'pii')
  sendPIIPHIEvent(phiEvents, date, 'phi')

  const eventsArrayChunk = eventsChunkArr(events, devEvents)
  sendNavigation(date, sessionId)
  eventsArrayChunk.forEach((array) => {
    const eventsArray = getEventPayloadArr(array, date, sessionId)
    if (eventsArray.length === 0) {
      return
    }

    const payload = getPayload(sdkDataForDate.sessions[sessionId], events)
    const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
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
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const obj = createViewPortObject()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].viewPort.push(obj)
  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const setSessionPIIEvent = function (eventName, objectName, meta) {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(
    createDevEventInfoObj(eventName, objectName, meta, true, false))

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush) {
    syncEvents()
  }

  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}

export const setSessionPHIEvent = function (eventName, objectName, meta) {
  const sessionId = getSessionData(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsSDKDataForDate(date)
  sdkDataForDate.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(
    createDevEventInfoObj(eventName, objectName, meta, false, true))

  const isEventPush = checkEventPushEventCounter(sdkDataForDate.sessions[sessionId].eventsData)
  if (isEventPush) {
    syncEvents()
  }

  setEventsSDKDataForDate(date, sdkDataForDate)
  updateStore()
}
