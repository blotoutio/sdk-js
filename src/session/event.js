import { constants, highFreqEvents, isHighFreqEventOff } from '../config'
import {
  createDevEventInfoObj,
  createEventInfoObj,
  findObjIndex,
  getDate,
  getSelector,
  setNewDateObject
} from '../utils'
import { getSession, removeSession, setSession } from '../storage'
import { getEventsByDate, getStore as getEventsStore, setEventsByDate } from '../storage/event'
import { updatePreviousDayEndTime } from '.'
import { error } from '../common/logUtil'
import { maybeSync } from './utils'

export const setEvent = function (eventName, event, meta = {}) {
  if (!eventName || (isHighFreqEventOff && highFreqEvents.includes(eventName))) {
    return
  }

  const objectName = event && getSelector(event.target)
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const eventStore = getEventsStore()

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
  const date = getDate()
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

  const date = getDate()
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
