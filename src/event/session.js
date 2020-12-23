import { constants, highFreqEvents, isHighFreqEventOff, systemEventCode } from '../config'
import {
  findObjIndex,
  getMid, getNotSyncedDate,
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

export const setEvent = function (eventName, event, meta = {}) {
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

  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }

  const eventData = sdkData.sessions[sessionId].eventsData
  if (!eventData.eventsInfo) {
    eventData.eventsInfo = []
  }
  eventData.eventsInfo.push(createEventInfoObj(eventName, objectName, meta, event))
  setEventsByDate(date, sdkData)
}

export const setDevEvent = (eventName, objectName, meta) => {
  if (!eventName) {
    return
  }
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const obj = createDevEventInfoObj(eventName, objectName, meta, false, false)

  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }
  const eventsData = sdkData.sessions[sessionId].eventsData
  if (!eventsData.devCodifiedEventsInfo) {
    eventsData.devCodifiedEventsInfo = []
  }
  eventsData.devCodifiedEventsInfo.push(obj)

  maybeSync(eventsData)
  setEventsByDate(date, sdkData)
}

export const setStartDevEvent = (eventName, objectName, meta) => {
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
    eventArray.push(createDevEventInfoObj(eventName, objectName, meta, false, false))
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
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }

  const eventsData = sdkData.sessions[sessionId].eventsData
  if (!eventsData.devCodifiedEventsInfo) {
    eventsData.devCodifiedEventsInfo = []
  }
  eventsData.devCodifiedEventsInfo.push(eventObject)

  maybeSync(eventsData)
  setEventsByDate(date, sdkData)
  eventArray.splice(index, 1)
  eventArray = JSON.stringify(eventArray)
  setSession('startEvents', eventArray)
}

export const createEventInfoObj = (eventName, objectName, meta = {}, event = {}) => {
  if (!eventName) {
    return null
  }

  return {
    sentToServer: false,
    objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getRoot() ? getMid() : '',
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position: getPositionObject(event),
    metaInfo: meta,
    objectTitle: getObjectTitle(event, eventName),
    extraInfo: {
      mousePosX: event.clientX,
      mousePosY: event.clientY
    }
  }
}

export const getPreviousDateData = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = getEventsByDate(notSyncDate)
  const sessionId = getNotSynced(sdkDataForDate.sessions)
  return sdkDataForDate.sessions[sessionId].eventsData
}
