import { getSession } from '../storage'
import { constants } from '../config'
import { maybeSync } from './utils'
import { createDevEventInfoObj } from '../event/utils'
import { getStringDate } from '../common/timeUtil'
import { getSessionForDate, setSessionForDate } from '../event/session'

const setPersonalEvent = (eventName, objectName, meta, isPII) => {
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
  eventsData.devCodifiedEventsInfo.push(createDevEventInfoObj(eventName, objectName, meta, isPII, !isPII))

  maybeSync(eventsData)
  setSessionForDate(date, sessionId, session)
}

export const setSessionPIIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, true)
}

export const setSessionPHIEvent = (eventName, objectName, meta) => {
  setPersonalEvent(eventName, objectName, meta, false)
}
