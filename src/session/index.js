import { getSession } from '../storage'
import { constants, systemEventCode } from '../config'
import {
  getMid,
  getSystemMergeCounter,
  shouldApproximateTimestamp
} from '../utils'
import { getEventsByDate, setEventsByDate } from '../event/storage'
import { getNearestTimestamp, getPreviousDateString, getStringDate } from '../common/timeUtil'
import { getTempUseValue } from '../storage/sharedPreferences'
import { getReferrerUrlOfDateSession } from '../common/referrerUtil'
import { shouldCollectSystemEvents } from '../event/utils'

const getInfoPayload = (date, sessionId) => {
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return null
  }
  const session = sdkData.sessions[sessionId]
  if (!session) {
    return null
  }
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

export const addSessionInfoEvent = (events, eventsArrayChunk, date, sessionId) => {
  if (!shouldCollectSystemEvents()) {
    return eventsArrayChunk
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)
  const info = getInfoPayload(date, sessionId)
  if (!info) {
    return eventsArrayChunk
  }
  const chunkIndex = eventsArrayChunk.findIndex((arr) => arr.length < sysMergeCounterValue)
  if (chunkIndex === -1) {
    const sessionEvtArr = [info]
    eventsArrayChunk.push(sessionEvtArr)
  } else {
    eventsArrayChunk[chunkIndex].push(info)
  }
  return eventsArrayChunk
}

export const updatePreviousDayEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getPreviousDateString()

  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return
  }

  sdkData.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkData)
}

export const updateEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return
  }

  sdkData.sessions[sessionId].endTime = Date.now()
  setEventsByDate(date, sdkData)
}
