import {
  constants,
  highFreqEvents,
  isHighFreqEventOff,
  systemEventCode,
} from '../common/config'
import {
  getMid,
  getObjectTitle,
  getSelector,
  setNewDateObject,
} from '../common/utils'
import { getSession } from '../storage'
import { getEventsByDate, getStore, setEventsByDate } from './storage'
import { updatePreviousDayEndTime } from '../session'
import { maybeSync } from '../session/utils'
import { createDevEventInfoObj } from './utils'
import { getStringDate } from '../common/timeUtil'

const getPositionObject = (event) => {
  let height = -1
  let width = -1
  if (event && event.target) {
    if (event.target.offsetHeight) {
      height = event.target.offsetHeight
    }

    if (event.target.offsetWidth) {
      width = event.target.offsetWidth
    }
  }

  let x = -1
  let y = -1
  if (event.screenX != null && event.offsetX != null) {
    x = event.screenX - event.offsetX
  }

  if (event.screenY != null && event.offsetY != null) {
    y = event.screenY - event.offsetY
  }

  return { x, y, width, height }
}

export const setEvent = function (eventName, event) {
  if (
    !eventName ||
    (isHighFreqEventOff && highFreqEvents.includes(eventName))
  ) {
    return
  }

  const objectName = event && getSelector(event.target)
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const eventStore = getStore()

  if (eventStore && !eventStore[date]) {
    updatePreviousDayEndTime()
    setNewDateObject(date, eventStore)
    return
  }

  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }

  const eventData = session.eventsData
  if (!eventData.eventsInfo) {
    eventData.eventsInfo = []
  }

  eventData.eventsInfo.push(createEventInfoObj(eventName, objectName, event))
  setSessionForDate(date, sessionId, session)
  maybeSync(eventData)
}

export const setDevEvent = (eventName, data, eventCode = null) => {
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

  const obj = createDevEventInfoObj(eventName, null, data, eventCode)
  eventsData.devCodifiedEventsInfo.push(obj)

  setSessionForDate(date, sessionId, session)
  maybeSync(eventsData)
}

export const createEventInfoObj = (eventName, objectName, event) => {
  if (!eventName) {
    return null
  }

  const data = {
    sentToServer: false,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    evcs: systemEventCode[eventName],
    mid: getMid(),
  }

  if (event) {
    data.position = getPositionObject(event)
    data.objectTitle = getObjectTitle(event, eventName)
    data.extraInfo = {
      mousePosX: event.clientX || -1,
      mousePosY: event.clientY || -1,
    }
  }

  if (objectName) {
    data.objectName = objectName
  }

  return data
}

export const getSessionForDate = (date, sessionId) => {
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return null
  }

  return sdkData.sessions[sessionId]
}

export const setSessionForDate = (date, sessionId, data) => {
  if (!sessionId) {
    return
  }

  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  sdkData.sessions[sessionId] = data
  setEventsByDate(date, sdkData)
}
