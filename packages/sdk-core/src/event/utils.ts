import { getSessionDataValue, getSessionID } from '../storage'
import { getPayload } from '../network/payload'
import { getPublishUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { info } from '../common/logUtil'
import { getUIDFromLocal } from '../common/uidUtil'
import type {
  BasicEvent,
  EventOptions,
  EventPayload,
  EventType,
  SendEvent,
} from '../typings'
import { getSessionKeyForEventType } from '../storage/utils'

const getEventPayload = (event: BasicEvent, type: EventType): EventPayload => {
  const payload: EventPayload = {
    mid: event.mid,
    evn: event.name,
    scrn: event.urlPath,
    evt: event.tstmp,
    session_id: getSessionID(),
    type,
    screen: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
    },
    additionalData: getEventData(type),
  }

  const localID = getUIDFromLocal()
  if (localID) {
    payload.userid = localID
  }

  return payload
}

const getEventData = (type: EventType) => {
  const allData =
    (getSessionDataValue('dataAll') as Record<string, unknown>) || {}
  const typeKey = getSessionKeyForEventType(type)
  const typeData =
    (getSessionDataValue(typeKey) as Record<string, unknown>) || {}

  return {
    ...allData,
    ...typeData,
  }
}

export const sendEvent = (
  events: SendEvent[],
  options?: EventOptions
): void => {
  const eventsPayload: EventPayload[] = []
  events.forEach((event) => {
    const payload = getEventPayload(event.data, event.type)

    if (event.extra) {
      payload.additionalData = {
        ...payload.additionalData,
        ...event.extra,
      }
    }

    eventsPayload.push(payload)
  })

  if (eventsPayload.length === 0) {
    return
  }

  postRequest(
    getPublishUrl(),
    JSON.stringify(getPayload(eventsPayload)),
    options
  ).catch(info)
}

export const getSelector = (element?: Element): string => {
  if (!element) {
    return null
  }

  let className = ''
  if (element.className && typeof element.className === 'string') {
    className = `.${element.className.split(' ').join('.')}`
  }

  let id = ''
  if (element.id) {
    id = `#${element.id}`
  }

  return `${element.nodeName}${id}${className}`
}

export const getObjectTitle = (
  element: HTMLElement | HTMLImageElement
): null | string => {
  if (!element) {
    return null
  }

  if ('alt' in element && element.alt) {
    return element.alt
  }

  if (element.title) {
    return element.title
  }

  if (element.innerText) {
    return element.innerText.substring(0, 100)
  }

  return null
}
