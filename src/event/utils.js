import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { encryptRSA, stringToIntSum } from '../common/securityUtil'
import { getSession } from '../storage'
import { getPayload } from '../network/payload'
import { getPublishUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { info } from '../common/logUtil'
import { getUID } from '../common/uidUtil'
import { createDevEvent } from './create'
import { getSessionIDKey } from '../storage/key'

export const shouldCollectSystemEvents = () => {
  return getVariable('pushSystemEvents') === 1
}

const generateSubCode = (eventSum) => {
  return constants.DEVELOPER_EVENT_CUSTOM + (eventSum % 8899)
}

// TODO this will be a problem as we will not know if event with the
//  same code was already sent
export const codeForDevEvent = (eventName) => {
  if (!eventName) {
    return 0
  }

  return generateSubCode(stringToIntSum(eventName))
}

export const getEventPayload = (event) => {
  const sessionId = getSession(getSessionIDKey())

  const properties = {
    position: event.position,
    session_id: sessionId,
    screen: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
    },
  }

  if (event.objectName) {
    properties.obj = event.objectName
  }

  if (event.objectTitle) {
    properties.objT = event.objectTitle
  }

  if (event.mouse) {
    properties.mouse = event.mouse
  }

  if (event.metaInfo) {
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

export const sendEvent = (events, options) => {
  if (!events) {
    return
  }

  const eventsPayload = []
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

export const getSelector = (ele) => {
  if (!ele) {
    return 'Unknown'
  }

  if (ele.localName) {
    return (
      ele.localName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
  }

  if (ele.nodeName) {
    return (
      ele.nodeName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
  }

  if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return 'Window'
  }

  return 'Unknown'
}

export const createPersonalEvent = (event) => {
  if (!event.name) {
    return
  }

  const devEvent = createDevEvent(event.name, event.data)
  const key = event.options.PII ? 'piiPublicKey' : 'phiPublicKey'
  const eventPayload = getEventPayload(devEvent)
  const publicKey = getVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify([eventPayload]))

  const extra = {}
  if (event.options.PII) {
    devEvent.pii = obj
  } else {
    devEvent.phi = obj
  }

  return {
    data: devEvent,
    extra,
  }
}
