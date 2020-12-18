import { getSession } from '../storage'
import { constants, isApprox, isDevEvtStore, isSysEvtCollect, isSysEvtStore, systemEventCode } from '../config'
import {
  eventsChunkArr,
  getDate,
  getEventPayloadArr, getMid,
  getNotSyncedEvents, getPayload,
  getPreviousDate, getReferrerUrlOfDateSession, getSystemMergeCounter,
  sendNavigation,
  sendPIIPHIEvent, setEventsSentToServer
} from '../utils'
import { getEventsByDate, setEventsByDate } from '../storage/event'
import { updateRoot } from '../storage/store'
import { getNotSyncedSession } from './utils'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getNearestTimestamp } from '../common/timeUtil'
import { getTempUseValue } from '../storage/sharedPreferences'

export const updatePreviousDayEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getPreviousDate()

  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkDataForDate)
  updateRoot()
}

export const updateSessionEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)

  sdkDataForDate.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkDataForDate)
  updateRoot()
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
      .catch(error)
  })
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
