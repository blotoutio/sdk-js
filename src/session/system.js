import { getSelector } from '../utils'
import { getSession } from '../storage'
import { constants } from '../config'
import { getEventsByDate, setEventsByDate } from '../event/storage'
import { createViewPortObject } from './utils'
import { createEventInfoObj } from '../event/session'
import { getStringDate } from '../common/timeUtil'

export const setDNTEvent = function (event) {
  const eventName = 'dnt'
  if (!event) {
    return
  }
  const objectName = getSelector(event.target)
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }
  const eventsInfo = sdkData.sessions[sessionId].eventsData.eventsInfo
  if (!eventsInfo) {
    return
  }
  const refIndex = eventsInfo.findIndex((obj) => obj.name === eventName)
  if (refIndex !== -1) {
    return
  }

  eventsInfo.push(createEventInfoObj(eventName, objectName, {}, event))
  setEventsByDate(date, sdkData)
}

export const setViewPort = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const obj = createViewPortObject()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return
  }
  const session = sdkData.sessions[sessionId]
  if (!session.viewPort) {
    session.viewPort = []
  }
  session.viewPort.push(obj)
  setEventsByDate(date, sdkData)
}
