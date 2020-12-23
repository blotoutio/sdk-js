import {
  constants,
  systemEventCode
} from '../config'
import {
  getMid,
  getObjectTitle,
  getDate,
  getAllEventsOfDate,
  getSelector,
  setNewDateObject,
  getEventPayloadArr,
  getPayload,
  shouldApproximateTimestamp,
  shouldCollectSystemEvents
} from '../utils'
import * as log from '../common/logUtil'
import { postRequest } from '../common/networkUtil'
import { getNearestTimestamp } from '../common/timeUtil'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { getSession } from '../storage'
import { getEventsByDate, getStore as getEventsStore } from '../storage/event'
import { getTempUseValue } from '../storage/sharedPreferences'
import { updatePreviousDayEndTime } from '../session'
import { createEventInfoObj } from '../session/event'
import { getReferrerUrlOfDateSession } from '../common/referrer'

const createScrollEventInfo = (eventName, objectName, meta = {}, event = {}, mousePos = {}) => {
  const position = {
    x: mousePos.mousePosX != null ? mousePos.mousePosX : -1,
    y: mousePos.mousePosY != null ? mousePos.mousePosY : -1,
    width: -1,
    height: -1
  }

  return {
    sentToServer: false,
    objectName: objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position,
    metaInfo: meta,
    objectTitle: getObjectTitle(event, eventName)
  }
}

const send = (eventsArray) => {
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(getDate())

  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArray)
  const url = getManifestUrl()

  postRequest(url, JSON.stringify(payload))
    .then(() => {})
    .catch(log.error)
}

const getScrollPayloadArray = (arr, date, sessionId, startTime, endTime, viewPortObj) => {
  const dateEvents = getAllEventsOfDate(date)
  const propObj = {
    referrer: getReferrerUrlOfDateSession(date, sessionId),
    startT: startTime,
    endT: endTime,
    screen: viewPortObj,
    session_id: sessionId
  }
  const UID = getTempUseValue(constants.UID)
  const result = []
  arr.forEach((val) => {
    if (!val) {
      return
    }

    propObj.mPosition = val.position
    const eventTime = shouldApproximateTimestamp() ? getNearestTimestamp(val.tstmp) : val.tstmp
    const eventCount = dateEvents.filter((evt) => evt.name === val.name)
    result.push({
      mid: val.mid,
      userid: UID,
      evn: val.name,
      evcs: val.evcs,
      evdc: eventCount.length,
      scrn: val.urlPath,
      evt: eventTime,
      properties: propObj,
      nmo: val.nmo,
      evc: val.evc
    })
  })

  return result
}

export const getHoverEventData = (eventName, e, meta) => {
  return createEventInfoObj(eventName, getSelector(e.target), meta, e)
}

export const getsScrollEventData = (eventName, e, meta, mousePos) => {
  return createScrollEventInfo(
    eventName,
    getSelector(e.target),
    meta,
    e,
    mousePos)
}

export const sendEvents = (array) => {
  if (!shouldCollectSystemEvents()) {
    return
  }

  const date = getDate()
  const store = getEventsStore()
  if (store && !store[date]) {
    updatePreviousDayEndTime()
    setNewDateObject(date, store)
  }

  const sessionId = getSession(constants.SESSION_ID)
  const eventsArray = getEventPayloadArr(array, date, sessionId)
  if (eventsArray.length === 0) {
    return
  }

  send(eventsArray)
}

export const sendScrollEvents = (arr, startTime, endTime) => {
  if (!shouldCollectSystemEvents()) {
    return
  }

  const date = getDate()
  const store = getEventsStore()
  if (store && !store[date]) {
    updatePreviousDayEndTime()
    setNewDateObject(date, store)
  }

  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const viewportLen = sdkDataForDate.sessions[sessionId].viewPort.length
  const viewPortObj = sdkDataForDate.sessions[sessionId].viewPort[viewportLen - 1]
  const eventsArray = getScrollPayloadArray(
    arr,
    date,
    sessionId,
    startTime,
    endTime,
    viewPortObj
  )

  if (eventsArray.length === 0) {
    return
  }

  send(eventsArray)
}
