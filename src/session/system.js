import { createEventInfoObj, createViewPortObject, getDate, getSelector } from '../utils'
import { getSession } from '../storage'
import { constants } from '../config'
import { getEventsByDate, setEventsByDate } from '../storage/event'
import { updateRoot } from '../storage/store'
import { info } from '../common/logUtil'

export const setDNTEvent = function (eventName, event, meta) {
  try {
    const objectName = getSelector(event.target)
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsByDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
      .findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsByDate(date, sdkDataForDate)
    updateRoot()
  } catch (error) {
    info(error)
  }
}

export const setViewPort = function () {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const obj = createViewPortObject()
  const sdkDataForDate = getEventsByDate(date)
  sdkDataForDate.sessions[sessionId].viewPort.push(obj)
  setEventsByDate(date, sdkDataForDate)
  updateRoot()
}
