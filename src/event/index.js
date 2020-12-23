import {
  getDate,
  getMid,
  getNotSyncedDate,
  getPayload,
  getSelector,
  setNewDateObject,
  shouldApproximateTimestamp,
  shouldSyncStoredData
} from '../utils'
import { createEventInfoObj } from './session'
import {
  createDevEventInfoObj,
  eventsChunkArr,
  eventSync,
  getEventPayloadArr,
  shouldCollectSystemEvents
} from './utils'
import { getSession } from '../storage'
import {
  callInterval,
  constants,
  highFreqEvents,
  isDevEvtCollect,
  isHighFreqEventOff,
  systemEventCode
} from '../config'
import { getEventsByDate, getStore, setEventsByDate } from './storage'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getManifestVariable } from '../manifest'
import { encryptRSA } from '../common/securityUtil'
import { addSessionInfoEvent, updatePreviousDayEndTime } from '../session'
import { getNotSynced } from '../session/utils'
import { getReferrerUrlOfDateSession } from '../common/referrer'
import { getNearestTimestamp } from '../common/timeUtil'
import { getTempUseValue } from '../storage/sharedPreferences'

let collectEventsArr = []
let globalEventInterval = null

const getNavigationPayloadArr = (navigations, navigationsTime) => {
  const UID = getTempUseValue(constants.UID)
  const eventTime = shouldApproximateTimestamp() ? getNearestTimestamp(Date.now()) : Date.now()
  return [{
    mid: getMid(),
    userid: UID,
    evn: constants.NAVIGATION,
    evcs: systemEventCode[constants.NAVIGATION],
    evdc: 1,
    scrn: window.location.href,
    evt: eventTime,
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    nvg: navigations,
    nvg_tm: navigationsTime
  }]
}

const sendNavigation = (date, sessionId) => {
  const sdkDataForDate = getEventsByDate(date)
  if (!sdkDataForDate || !sdkDataForDate.sessions || !sdkDataForDate.sessions[sessionId] || !sdkDataForDate.sessions[sessionId].eventsData) {
    return
  }
  const eventsData = sdkDataForDate.sessions[sessionId].eventsData
  const navigations = eventsData.navigationPath && eventsData.navigationPath.slice()
  const navigationsTime = eventsData.stayTimeBeforeNav && eventsData.stayTimeBeforeNav.slice()
  if (!navigations || !navigationsTime || navigations.length === 0 || navigations.length !== navigationsTime.length) {
    return
  }

  const referrer = getReferrerUrlOfDateSession(date, sessionId)
  if (referrer != null) {
    navigations.unshift(referrer)
    navigationsTime.unshift(0)
  }

  const navEventArr = getNavigationPayloadArr(navigations, navigationsTime)
  const payload = getPayload(sdkDataForDate.sessions[sessionId], navEventArr)
  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => { })
    .catch(error)
}

const getEventData = (eventName, event, type) => {
  const objectName = getSelector(event.target)
  if (type === 'system') {
    return createEventInfoObj(eventName, objectName, {}, event)
  }

  return createDevEventInfoObj(eventName, objectName, {}, false, false)
}

const sendEvents = (arr) => {
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const eventsArr = getEventPayloadArr(arr, date, sessionId)
  if (eventsArr.length === 0) {
    return
  }

  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => { })
    .catch(error)
}

export const collectEvent = (eventName, event, type) => {
  if (isHighFreqEventOff && highFreqEvents.includes(eventName)) {
    return
  }

  collectEventsArr.push(getEventData(eventName, event, type))
  setTimeout(() => {
    const eventsArray = collectEventsArr
    collectEventsArr = []
    sendEvents(eventsArray)
  }, constants.COLLECT_TIMEOUT)
}

export const sendPIIPHIEvent = (events, date, type) => {
  if (events && events.length === 0) {
    return
  }

  const key = type === 'pii' ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const publicKey = getManifestVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify(eventsArr))

  const payload = getPayload(sdkDataForDate.sessions[sessionId])

  if (type === 'pii') {
    payload.pii = obj
  } else {
    payload.phi = obj
  }

  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(error)
}

export const getNotSyncedEvents = (obj) => {
  let events = []
  let devEvents = []
  let piiEvents = []
  let phiEvents = []
  if (shouldCollectSystemEvents() && obj.eventsInfo) {
    events = obj.eventsInfo.filter((evt) => !evt.sentToServer && !evt.isPii && !evt.isPhi)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    piiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPii)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    phiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPhi)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  }
  return { events, devEvents, piiEvents, phiEvents }
}

export const setSyncEventsInterval = () => {
  if (!shouldSyncStoredData()) {
    return
  }

  let eventPushInterval = getManifestVariable(constants.EVENT_PUSH_INTERVAL)
  if (eventPushInterval == null) {
    eventPushInterval = constants.DEFAULT_EVENT_PUSH_INTERVAL
  }
  eventPushInterval = eventPushInterval || callInterval
  const eventPushIntervalInSec = eventPushInterval * 60 * 60 * 1000
  if (globalEventInterval) {
    clearInterval(globalEventInterval)
  }
  globalEventInterval = setInterval(() => {
    const date = getDate()
    const eventStore = getStore()
    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
    } else {
      syncEvents()
    }
  }, eventPushIntervalInSec)
}

export const setEventsSentToServer = (arr, date, sessionId) => {
  const currentSessionId = getSession(constants.SESSION_ID)
  arr.forEach((val) => {
    const sdkDataOfDate = getEventsByDate(date)
    if (!sdkDataOfDate) {
      return
    }
    const mID = val.mid
    const evtIndex = sdkDataOfDate.sessions[sessionId].eventsData.eventsInfo
      .findIndex((obj) => obj.mid === mID)
    const devEventIndex = sdkDataOfDate.sessions[sessionId].eventsData.devCodifiedEventsInfo
      .findIndex((obj) => obj.mid === mID)

    if (evtIndex !== -1) {
      sdkDataOfDate.sessions[sessionId].eventsData.eventsInfo[evtIndex].sentToServer = true
    }
    if (devEventIndex !== -1) {
      sdkDataOfDate.sessions[sessionId].eventsData.devCodifiedEventsInfo[devEventIndex].sentToServer = true
    }
    if (currentSessionId !== sessionId) {
      sdkDataOfDate.sessions[sessionId].eventsData.sentToServer = true
    }
    setEventsByDate(date, sdkDataOfDate)
  })
  eventSync.progressStatus = false
}

export const getAllEventsOfDate = (date) => {
  const sdkDataForDate = getEventsByDate(date)
  const sessions = sdkDataForDate.sessions
  let arrEvent = []
  for (const x in sessions) {
    arrEvent = arrEvent.concat(sdkDataForDate.sessions[x].eventsData.eventsInfo)
    arrEvent = arrEvent.concat(sdkDataForDate.sessions[x].eventsData.devCodifiedEventsInfo)
  }
  return arrEvent
}

export const syncEvents = (sessionId, date) => {
  if (!shouldSyncStoredData()) {
    eventSync.progressStatus = false
    return
  }

  setSyncEventsInterval()
  let session = true
  if (!date) {
    date = getDate()
  }

  if (!sessionId) {
    sessionId = getSession(constants.SESSION_ID)
    session = false
  }

  const sdkDataForDate = getEventsByDate(date)
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkDataForDate.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, date, 'pii')
  sendPIIPHIEvent(phiEvents, date, 'phi')

  let eventsArrayChunk = eventsChunkArr(events, devEvents) || []
  if (session) {
    eventsArrayChunk = addSessionInfoEvent(events, eventsArrayChunk, date, sessionId)
    sendNavigation(date, sessionId)
  }
  eventsArrayChunk.forEach((arr) => {
    const eventsArr = getEventPayloadArr(arr, date, sessionId)
    if (eventsArr.length === 0) {
      return
    }

    const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
    const url = getManifestUrl()
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(arr, date, sessionId)
      })
      .catch(error)
  })
}

export const syncPreviousEvents = () => {
  const date = getDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  const sessionId = getNotSynced(sdkData.sessions)
  const currentSessionId = getSession(constants.SESSION_ID).toString()
  if (currentSessionId === sessionId) {
    return
  }

  syncEvents(sessionId, date)
}

export const syncPreviousDateEvents = () => {
  const date = getNotSyncedDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  const sessionId = getNotSynced(sdkData.sessions)
  syncEvents(sessionId, date)
}

const getBounceAndSessionEvents = (obj) => {
  const sessionId = getSession(constants.SESSION_ID)
  return obj.sessions[sessionId].eventsData.eventsInfo
    .filter((evt) => evt.name === constants.BOUNCE || constants.SESSION)
}

export const sendBounceEvent = (date) => {
  const sdkDataForDate = getEventsByDate(date)
  const events = getBounceAndSessionEvents(sdkDataForDate)
  const sessionId = getSession(constants.SESSION_ID)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)

  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(error)
}
