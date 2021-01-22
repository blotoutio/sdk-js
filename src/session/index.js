import { getSession } from '../storage'
import { constants, systemEventCode } from '../config'
import { getMid, getSystemMergeCounter } from '../utils'
import { getPreviousDateString, getStringDate } from '../common/timeUtil'
import { getTempUseValue } from '../storage/sharedPreferences'
import { getReferrerUrlOfDateSession } from '../common/referrerUtil'
import { getSessionForDate, setSessionForDate } from '../event/session'

const getInfoPayload = (date, sessionId) => {
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return null
  }
  const viewportLen = (session.viewPort || []).length
  const viewPortObj = viewportLen > 0 ? session.viewPort[viewportLen - 1] : null
  const startTime = session.startTime
  const endTime = session.endTime
  let durationInSecs = Math.floor((endTime - startTime) / 1000)
  if (durationInSecs < 0) {
    durationInSecs = 0
  }

  const info = {
    mid: getMid(),
    userid: getTempUseValue(constants.UID),
    evn: constants.SESSION_INFO,
    evcs: systemEventCode.sessionInfo,
    evdc: 1,
    scrn: window.location.href,
    evt: Date.now(),
    properties: {
      referrer: getReferrerUrlOfDateSession(date, sessionId),
      session_id: sessionId,
      start: startTime,
      end: endTime,
      duration: durationInSecs
    },
    nmo: 1,
    evc: constants.EVENT_CATEGORY
  }

  if (viewPortObj) {
    info.properties.screen = viewPortObj
  }

  return info
}

export const addSessionInfoEvent = (events, eventsArrayChunk, date, sessionId) => {
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
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  session.endTime = Date.now()
  setSessionForDate(date, sessionId, session)
}

export const updateEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  session.endTime = Date.now()
  setSessionForDate(date, sessionId, session)
}
