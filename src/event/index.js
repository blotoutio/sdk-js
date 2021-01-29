import { getEventPayload, getSelector, sendEvent } from './utils'
import { constants, highFreqEvents, isHighFreqEventOff } from '../common/config'
import { error } from '../common/logUtil'
import { createDevEvent, createEvent } from './create'
import { getVariable } from '../common/manifest'
import { encryptRSA } from '../common/securityUtil'

export const mapID = (id, provider, data) => {
  if (!id) {
    error('ID mapping is missing id')
    return
  }

  if (!data) {
    data = {}
  }

  data.map_id = id
  data.map_provider = provider
  setDevEvent(constants.MAP_ID_EVENT, data, null, constants.MAP_ID_EVENT_CODE)
}

export const setStartEvent = () => {
  setEvent('sdk_start')
}

export const setEvent = function (eventName, event, options = null) {
  if (
    !eventName ||
    (isHighFreqEventOff && highFreqEvents.includes(eventName))
  ) {
    return
  }

  const objectName = event && getSelector(event.target)

  const info = createEvent(eventName, objectName, event)
  sendEvent(info, options)
}

export const setDevEvent = (
  eventName,
  data,
  options = null,
  eventCode = null
) => {
  if (!eventName) {
    return
  }
  const event = createDevEvent(eventName, null, data, eventCode)
  sendEvent(event, options)
}

export const setPersonalEvent = (eventName, data, options, isPII = false) => {
  if (!eventName) {
    return
  }
  const event = createDevEvent(eventName, null, data)
  const key = isPII ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const eventPayload = getEventPayload(event)
  const publicKey = getVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify([eventPayload]))

  const extra = {}
  if (isPII) {
    extra.pii = obj
  } else {
    extra.phi = obj
  }
  sendEvent(event, options, extra)
}
