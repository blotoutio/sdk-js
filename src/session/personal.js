import { getSession } from '../storage'
import { constants } from '../config'
import { checkEventPushEventCounter, createDevEventInfoObj, getDate, syncEvents } from '../utils'
import { getEventsByDate, setEventsByDate } from '../storage/event'
import { eventSync } from './utils'
import { updateRoot } from '../storage/store'

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
  updateRoot()
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
  updateRoot()
}
