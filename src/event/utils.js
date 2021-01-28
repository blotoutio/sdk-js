import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { stringToIntSum } from '../common/securityUtil'
import { getSession } from '../storage'
import { getPayload } from '../common/payloadUtil'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getUID } from '../common/uidUtil'
import { getReferrer } from '../common/referrerUtil'

export const shouldCollectSystemEvents = () => {
  let collect = getVariable(constants.PUSH_SYSTEM_EVENTS)
  if (collect == null || collect === '0') {
    collect = constants.DEFAULT_PUSH_SYSTEM_EVENTS
  }

  return collect
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
  const sessionId = getSession(constants.SESSION_ID)

  const properties = {
    referrer: getReferrer(),
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

export const sendEvent = (event, extra) => {
  let eventPayload = getEventPayload(event)
  eventPayload = Object.assign(eventPayload, extra)
  const payload = getPayload(eventPayload)
  postRequest(getManifestUrl(), JSON.stringify(payload))
    .then(() => {})
    .catch(error)
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
