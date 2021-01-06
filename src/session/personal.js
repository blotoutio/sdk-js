import { getSession } from '../storage'
import { constants } from '../config'
import { maybeSync } from './utils'
import { createDevEventInfoObj } from '../event/utils'
import { getStringDate } from '../common/timeUtil'
import { getSessionForDate, setSessionForDate } from '../event/session'

const setPersonalEvent = (eventName, objectName, data, isPII) => {
  if (!eventName) {
    return
  }

  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }

  const eventsData = session.eventsData
  if (!eventsData.devCodifiedEventsInfo) {
    eventsData.devCodifiedEventsInfo = []
  }
  const event = createDevEventInfoObj(eventName, objectName, data)
  if (isPII) {
    event.isPii = true
  } else {
    event.isPhi = true
  }
  eventsData.devCodifiedEventsInfo.push(event)

  maybeSync(eventsData)
  setSessionForDate(date, sessionId, session)
}

export const setSessionPIIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, true)
}

export const setSessionPHIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, false)
}
