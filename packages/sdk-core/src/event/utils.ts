import { constants } from '../common/config'
import { stringToIntSum } from '../common/securityUtil'
import { getSessionDataValue, getSessionID } from '../storage'
import { getPayload } from '../network/payload'
import { getPublishUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { info } from '../common/logUtil'
import { getUID } from '../common/uidUtil'
import type {
  BasicEvent,
  EventOptions,
  EventPayload,
  EventType,
  SendEvent,
} from '../typings'
import { getSessionKeyForEventType } from '../storage/utils'

const getEventPayload = (event: BasicEvent, type: EventType): EventPayload => {
  return {
    mid: event.mid,
    userid: getUID(),
    evn: event.name,
    evcs: event.evcs,
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

const generateSubCode = (eventSum: number): number => {
  return constants.DEVELOPER_EVENT_CUSTOM + (eventSum % 8899)
}

// TODO this will be a problem as we will not know if event with the
//  same code was already sent
export const codeForDevEvent = (eventName: string): number => {
  if (!eventName) {
    return 0
  }

  return generateSubCode(stringToIntSum(eventName))
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

export const getSelector = (element?: HTMLElement): string => {
  if (!element) {
    return null
  }

  let className = ''
  if (element.className) {
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
