import {
  highFreqEvents,
  isHighFreqEventOff,
  systemEventCode,
} from '../common/config'
import { getMid, getObjectTitle, getSelector } from '../common/utils'
import { createDevEventInfoObj, sendEvents } from './utils'

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

  const info = createEventInfoObj(eventName, objectName, event)
  sendEvents([info])
}

export const setDevEvent = (eventName, data, eventCode = null) => {
  if (!eventName) {
    return
  }
  const event = createDevEventInfoObj(eventName, null, data, eventCode)
  sendEvents([event])
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
