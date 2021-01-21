import { constants, highFreqEvents, isHighFreqEventOff, systemEventCode } from '../config'
import {
  findObjIndex,
  getMid,
  getNotSyncedDate,
  getObjectTitle,
  getSelector,
  setNewDateObject
} from '../utils'
import { getSession, removeSession, setSession } from '../storage'
import { getEventsByDate, getStore, setEventsByDate } from './storage'
import { updatePreviousDayEndTime } from '../session'
import { error } from '../common/logUtil'
import { getNotSynced, maybeSync } from '../session/utils'
import { getRoot } from '../storage/store'
import { createDevEventInfoObj } from './utils'
import { getStringDate } from '../common/timeUtil'
import { createScrollEventInfo } from './system/utils.js'

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

export const setEvent = function (eventName, event, mousePos = {}) {
  if (!eventName || (isHighFreqEventOff && highFreqEvents.includes(eventName))) {
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
  if (eventName === 'scroll') {
    eventData.eventsInfo.push(createScrollEventInfo(
      eventName,
      objectName,
      { },
      event,
      mousePos))
  } else {
    eventData.eventsInfo.push(createEventInfoObj(eventName, objectName, { }, event))
  }

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

export const setStartDevEvent = (eventName, data) => {
  if (!eventName) {
    return
  }

  let eventArray = []
  try {
    eventArray = JSON.parse(getSession('startEvents')) || []
  } catch (e) {
    error(e)
  }

  const index = findObjIndex(eventArray, eventName)
  if (index === -1) {
    eventArray.push(createDevEventInfoObj(eventName, null, data))
  } else {
    eventArray[index].startTime = Date.now()
  }
  setSession('startEvents', JSON.stringify(eventArray))
}

export const setEndDevEvent = (eventName) => {
  if (!eventName) {
    return
  }

  let eventArray = []
  try {
    eventArray = JSON.parse(getSession('startEvents')) || []
  } catch (e) {
    removeSession('startEvents')
    return
  }

  const index = findObjIndex(eventArray, eventName)
  if (index === -1) {
    error('Event did not start yet')
    return
  }

  const eventObject = eventArray[index]
  const diffTime = Date.now() - eventObject.tstmp
  eventObject.duration = Math.floor(diffTime / 1000)

  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }

  const eventsData = session.eventsData
  if (!eventsData.devCodifiedEventsInfo) {
    eventsData.devCodifiedEventsInfo = []
  }
  eventsData.devCodifiedEventsInfo.push(eventObject)

  setSessionForDate(date, sessionId, session)
  maybeSync(eventsData)
  eventArray.splice(index, 1)
  eventArray = JSON.stringify(eventArray)
  setSession('startEvents', eventArray)
}

export const createEventInfoObj = (eventName, objectName, meta = {}, event = {}) => {
  if (!eventName) {
    return null
  }

  const data = {
    sentToServer: false,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getRoot() ? getMid() : '', // TODO(nejc): why do we check root here?
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position: getPositionObject(event),
    objectTitle: getObjectTitle(event, eventName),
    extraInfo: {
      mousePosX: event.clientX || -1,
      mousePosY: event.clientY || -1
    }
  }

  if (meta) {
    data.metaInfo = meta
  }

  if (objectName) {
    data.objectName = objectName
  }

  return data
}

export const getPreviousDateData = () => {
  const date = getNotSyncedDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return null
  }

  const sessionId = getNotSynced(sdkData.sessions)
  if (!sessionId) {
    return null
  }
  return sdkData.sessions[sessionId].eventsData
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
