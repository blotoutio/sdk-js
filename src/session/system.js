import { getSession } from '../storage'
import { constants } from '../config'
import { createViewPortObject } from './utils'
import {
  createEventInfoObj,
  getSessionForDate,
  setSessionForDate,
} from '../event/session'
import { getStringDate } from '../common/timeUtil'

export const setDNTEvent = function () {
  const eventName = 'dnt'
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }
  const eventsInfo = session.eventsData.eventsInfo
  if (!eventsInfo) {
    return
  }
  const refIndex = eventsInfo.findIndex((obj) => obj.name === eventName)
  if (refIndex !== -1) {
    return
  }

  eventsInfo.push(createEventInfoObj(eventName))
  setSessionForDate(date, sessionId, session)
}

export const setViewPort = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  if (!session.viewPort) {
    session.viewPort = []
  }
  const obj = createViewPortObject()
  session.viewPort.push(obj)
  setSessionForDate(date, sessionId, session)
}
