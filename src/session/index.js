import { getSession } from '../storage'
import { constants, systemEventCode } from '../config'
import {
  eventsChunkArr,
  getDate,
  getEventPayloadArr,
  getMid,
  getNotSyncedEvents,
  getPayload,
  getPreviousDate,
  getSystemMergeCounter,
  sendPIIPHIEvent,
  setEventsSentToServer,
  shouldSyncStoredData,
  getNotSyncedDate,
  shouldApproximateTimestamp,
  shouldCollectSystemEvents
} from '../utils'
import { getEventsByDate, setEventsByDate } from '../event/storage'
import { getNotSynced } from './utils'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getNearestTimestamp } from '../common/timeUtil'
import { getTempUseValue } from '../storage/sharedPreferences'
import { getReferrerUrlOfDateSession } from '../common/referrer'

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

const getInfoPayload = (date, sessionId) => {
  const sdkData = getEventsByDate(date)
  const session = sdkData.sessions[sessionId]
  const viewportLen = (session.viewPort || []).length
  const viewPortObj = viewportLen > 0 ? session.viewPort[viewportLen - 1] : {}
  const startTime = session.startTime
  const endTime = session.endTime
  let durationInSecs = Math.floor((endTime - startTime) / 1000)
  if (durationInSecs < 0) {
    durationInSecs = 0
  }

  return {
    mid: getMid(),
    userid: getTempUseValue(constants.UID),
    evn: constants.SESSION_INFO,
    evcs: systemEventCode.sessionInfo,
    evdc: 1,
    scrn: window.location.href,
    evt: shouldApproximateTimestamp() ? getNearestTimestamp(Date.now()) : Date.now(),
    properties: {
      referrer: getReferrerUrlOfDateSession(date, sessionId),
      screen: viewPortObj,
      session_id: sessionId,
      start: startTime,
      end: endTime,
      duration: durationInSecs
    },
    nmo: 1,
    evc: constants.EVENT_CATEGORY
  }
}

const syncEvents = (sdkData, sessionId, date) => {
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkData.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, date, 'pii')
  sendPIIPHIEvent(phiEvents, date, 'phi')

  let eventsArrayChunk = eventsChunkArr(events, devEvents) || []
  eventsArrayChunk = addSessionInfoEvent(events, eventsArrayChunk, date, sessionId)
  sendNavigation(date, sessionId)
  eventsArrayChunk.forEach((array) => {
    const eventsArray = getEventPayloadArr(array, date, sessionId)
    if (eventsArray.length === 0) {
      return
    }

    const payload = getPayload(sdkData.sessions[sessionId], eventsArray)
    const url = getManifestUrl()
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(array, date, sessionId)
      })
      .catch(error)
  })
}

const addSessionInfoEvent = function (events, eventsArrayChunk, date, sessionId) {
  if (!shouldCollectSystemEvents()) {
    return eventsArrayChunk
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)

  const sessionInfoObj = getInfoPayload(date, sessionId)
  const chunkIndex = eventsArrayChunk.findIndex((arr) => arr.length < sysMergeCounterValue)
  if (chunkIndex === -1) {
    const sessionEvtArr = [sessionInfoObj]
    eventsArrayChunk.push(sessionEvtArr)
  } else {
    eventsArrayChunk[chunkIndex].push(sessionInfoObj)
  }
  return eventsArrayChunk
}

export const updatePreviousDayEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getPreviousDate()

  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return
  }

  sdkData.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkData)
}

export const updateEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return
  }

  sdkData.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkData)
}

export const syncPreviousEvents = () => {
  if (!shouldSyncStoredData()) {
    return
  }

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

  syncEvents(sdkData, sessionId, date)
}

export const syncPreviousDateEvents = () => {
  if (!shouldSyncStoredData()) {
    return
  }

  const date = getNotSyncedDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  const sessionId = getNotSynced(sdkData.sessions)

  syncEvents(sdkData, sessionId, date)
}
