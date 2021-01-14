import { constants, systemEventCode } from '../../config'
import {
  getMid,
  getObjectTitle,
  getSelector,
  setNewDateObject
} from '../../utils'
import * as log from '../../common/logUtil'
import { postRequest } from '../../common/networkUtil'
import { getStringDate } from '../../common/timeUtil'
import { getManifestUrl } from '../../common/endPointUrlUtil'
import { getSession } from '../../storage'
import { getStore } from '../storage'
import { updatePreviousDayEndTime } from '../../session'
import { createEventInfoObj, getSessionForDate } from '../session'
import { getEventPayloadArr, shouldCollectSystemEvents } from '../utils'
import { getPayload } from '../../common/payloadUtil'

export const createScrollEventInfo = (eventName, objectName, meta = {}, event = {}, mousePos = {}) => {
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
  const session = getSessionForDate(getStringDate(), sessionId)
  if (!session) {
    return
  }

  const payload = getPayload(session, eventsArray)
  const url = getManifestUrl()

  postRequest(url, JSON.stringify(payload))
    .then(() => {})
    .catch(log.error)
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

  const date = getStringDate()
  const store = getStore()
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
