import { constants, highFreqEvents, isHighFreqEventOff } from '../config'
import {
  checkEventPushEventCounter,
  createDevEventInfoObj,
  createEventInfoObj, findObjIndex,
  getDate,
  getSelector, isEventExist,
  setNewDateObject, syncEvents
} from '../utils'
import { getSession, setSession } from '../storage'
import { getEventsByDate, getStore as getEventsStore, setEventsByDate } from '../storage/event'
import { updatePreviousDayEndTime } from '.'
import { updateRoot } from '../storage/store'
import { error, info } from '../common/logUtil'
import { eventSync } from './utils'

export const setEvent = function (eventName, event, meta = {}) {
  if (isHighFreqEventOff && highFreqEvents.includes(eventName)) {
    return
  }

  try {
    const objectName = getSelector(event.target)
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const eventStore = getEventsStore()

    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
      return
    }

    const sdkData = getEventsByDate(date)
    sdkData.sessions[sessionId].eventsData.eventsInfo.push(
      createEventInfoObj(eventName, objectName, meta, event)
    )
    setEventsByDate(date, sdkData)
    updateRoot()
  } catch (error) {
    info(error)
  }
}

export const setDevEvent = (eventName, objectName, meta) => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const obj = createDevEventInfoObj(eventName, objectName, meta, false, false)

  const sdkData = getEventsByDate(date)
  sdkData.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(obj)

  const isEventPush = checkEventPushEventCounter(sdkData.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkData)
  updateRoot()
}

export const setStartDevEvent = (eventName, objectName, meta) => {
  let eventArray = JSON.parse(getSession('startEvents')) || []
  const isExist = isEventExist(eventArray, eventName)
  if (!isExist) {
    eventArray.push(
      createDevEventInfoObj(eventName, objectName, meta, false, false))
    eventArray = JSON.stringify(eventArray)
  } else {
    const index = findObjIndex(eventArray, eventName)
    eventArray[index].startTime = Date.now()
    eventArray = JSON.stringify(eventArray)
  }
  setSession('startEvents', eventArray)
}

export const setEndDevEvent = (eventName) => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  let eventArray = JSON.parse(getSession('startEvents')) || []
  const isExist = isEventExist(eventArray, eventName)
  if (!isExist) {
    error('Event did not start yet')
    return
  }

  const index = findObjIndex(eventArray, eventName)
  const eventObject = eventArray[index]
  const diffTime = Date.now() - eventObject.tstmp
  eventObject.duration = Math.floor(diffTime / 1000)

  const sdkData = getEventsByDate(date)
  sdkData.sessions[sessionId].eventsData.devCodifiedEventsInfo.push(eventObject)

  const isEventPush = checkEventPushEventCounter(sdkData.sessions[sessionId].eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }

  setEventsByDate(date, sdkData)
  updateRoot()

  if (eventArray.length === 0) {
    return
  }

  eventArray.splice(index, 1)
  eventArray = JSON.stringify(eventArray)
  setSession('startEvents', eventArray)
}
