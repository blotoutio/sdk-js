import { getSession } from '../storage'
import { constants } from '../config'
import { createDevEventInfoObj, getDate } from '../utils'
import { getEventsByDate, setEventsByDate } from '../storage/event'
import { maybeSync } from './utils'

const setPersonalEvent = (eventName, objectName, meta, isPII) => {
  if (!eventName) {
    return
  }

  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }

  const eventsData = sdkData.sessions[sessionId].eventsData
  if (!eventsData.devCodifiedEventsInfo) {
    eventsData.devCodifiedEventsInfo = []
  }
  eventsData.devCodifiedEventsInfo.push(createDevEventInfoObj(eventName, objectName, meta, isPII, !isPII))

  maybeSync(eventsData)
  setEventsByDate(date, sdkData)
}

export const setSessionPIIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, true)
}

export const setSessionPHIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, false)
}
