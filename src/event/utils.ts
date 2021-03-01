import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { stringToIntSum } from '../common/securityUtil'
import { getSession } from '../storage'
import { getPayload } from '../network/payload'
import { getPublishUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { info } from '../common/logUtil'
import { getUID } from '../common/uidUtil'
import { getSessionIDKey } from '../storage/key'

export const shouldCollectSystemEvents = (): boolean => {
  return getVariable('pushSystemEvents') === 1
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

export const getEventPayload = (
  event: SystemEvent | DevEvent
): EventPayload => {
  const sessionId = getSession(getSessionIDKey())

  const properties: EventPayloadProperties = {
    session_id: sessionId,
    screen: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
    },
  }

  if ('position' in event && event.position) {
    properties.position = event.position
  }

  if ('objectName' in event && event.objectName) {
    properties.obj = event.objectName
  }

  if ('objectTitle' in event && event.objectTitle) {
    properties.objT = event.objectTitle
  }

  if ('mouse' in event && event.mouse) {
    properties.mouse = event.mouse
  }

  if ('metaInfo' in event && event.metaInfo) {
    properties.codifiedInfo = event.metaInfo
  }

  return {
    mid: event.mid,
    userid: getUID(),
    evn: event.name,
    evcs: event.evcs,
    scrn: event.urlPath,
    evt: event.tstmp,
    properties,
  }
}

export const sendEvent = (
  events: SendEvent[],
  options?: EventOptions
): void => {
  const eventsPayload: EventPayload[] = []
  events.forEach((event) => {
    const extra = event.extra || {}
    eventsPayload.push(Object.assign(extra, getEventPayload(event.data)))
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
    return 'Unknown'
  }

  return (
    element.nodeName +
    (element.id ? '#' + element.id : '') +
    (element.className ? '.' + element.className : '')
  )
}
