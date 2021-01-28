import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { getMid } from '../common/utils'
import { stringToIntSum } from '../common/securityUtil'
import { getSession } from '../storage'
import { getPayload } from '../common/payloadUtil'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getUID } from '../common/uuidUtil'
import { getReferrer } from '../common/referrerUtil'
import { createViewPortObject } from '../session/utils'

export const createDevEventInfoObj = (
  eventName,
  objectName,
  data = null,
  eventCode = null
) => {
  const event = {
    sentToServer: false,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    evcs: eventCode || codeForCustomCodifiedEvent(eventName),
  }

  if (eventName) {
    event.name = eventName
  }

  if (objectName) {
    event.objectName = objectName
  }

  if (data) {
    event.metaInfo = data
  }

  return event
}

export const shouldCollectSystemEvents = () => {
  let collect = getVariable(constants.PUSH_SYSTEM_EVENTS)
  if (collect == null || collect === '0') {
    collect = constants.DEFAULT_PUSH_SYSTEM_EVENTS
  }

  return collect
}

// TODO what to do with this one?
const checkIfCodeExists = (eventName) => {
  // const customEventStore = getNormalUseValue(constants.CUSTOM_EVENT_STORAGE)
  // if (customEventStore) {
  //   const valueFoundIsEventCode = customEventStore[eventName]
  //   if (valueFoundIsEventCode) {
  //     return valueFoundIsEventCode
  //   }
  // }

  return 0
}

const generateSubCode = (eventSum) => {
  return constants.DEVELOPER_EVENT_CUSTOM + (eventSum % 8899)
}

// TODO this will be a problem as we will not know if event with the
//  same code was already sent
export const codeForCustomCodifiedEvent = (eventName) => {
  if (!eventName) {
    return 0
  }

  let eventSubCode = checkIfCodeExists(eventName)
  if (eventSubCode !== 0) {
    return eventSubCode
  }

  eventSubCode = generateSubCode(stringToIntSum(eventName))

  // const customEventStore =
  //   getNormalUseValue(constants.CUSTOM_EVENT_STORAGE) || {}
  // const keys = Object.keys(customEventStore)
  // for (let i = 0; i < keys.length; i++) {
  //   const valAsEventName = keys[i]
  //   if (customEventStore[valAsEventName] === eventSubCode) {
  //     eventNameIntSum += 1
  //     eventSubCode = generateSubCode(eventNameIntSum)
  //     i = 0 // re-looping again to check new code
  //   }
  // }
  //
  // customEventStore[eventName] = eventSubCode
  // setNormalUseValue(constants.CUSTOM_EVENT_STORAGE, customEventStore)

  return eventSubCode
}

export const getEventPayload = (array) => {
  const sessionId = getSession(constants.SESSION_ID)

  return array.map((val) => {
    const properties = {
      referrer: getReferrer(),
      position: val.position,
      session_id: sessionId,
      screen: createViewPortObject(),
    }

    if (val.objectName) {
      properties.obj = val.objectName
    }

    if (val.objectTitle) {
      properties.objT = val.objectTitle
    }

    if (val.mouse) {
      properties.mouse = val.mouse
    }

    if (val.metaInfo) {
      properties.codifiedInfo = val.metaInfo
    }

    // TODO
    // if (
    //   val.name === 'click' ||
    //   val.name === 'mouseover' ||
    //   val.name === 'hoverc' ||
    //   val.name === 'hover' ||
    //   val.name === 'dblclick'
    // ) {
    //   if (val.extraInfo) {
    //     properties.mouse = {
    //       x: val.extraInfo.mousePosX,
    //       y: val.extraInfo.mousePosY,
    //     }
    //   }
    // }

    return {
      mid: val.mid,
      userid: getUID(),
      evn: val.name,
      evcs: val.evcs,
      scrn: val.urlPath,
      evt: val.tstmp,
      properties,
    }
  })
}

export const sendEvents = (array) => {
  const events = getEventPayload(array)
  if (events.length === 0) {
    return
  }

  const payload = getPayload(events)
  postRequest(getManifestUrl(), JSON.stringify(payload))
    .then(() => {})
    .catch(error)
}
