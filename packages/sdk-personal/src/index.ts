import {
  EventOptions,
  IncomingEvent,
  internalUtils,
  SendEvent,
} from '@blotoutio/sdk-core'
import { encryptRSA } from './security'

const createPersonalEvent = (
  event: IncomingEvent,
  isPHI: boolean
): SendEvent => {
  const data = internalUtils.createEvent(event)
  if (!data) {
    return null
  }
  const key = isPHI ? 'phiPublicKey' : 'piiPublicKey'
  const eventPayload = internalUtils.getEventPayload(data)
  const publicKey = (internalUtils.getVariable(key) || '').toString()
  const obj = encryptRSA(publicKey, JSON.stringify([eventPayload]))
  data.metaInfo = null

  const extra: SendEventExtra = {}
  if (isPHI) {
    extra.phi = obj
  } else {
    extra.pii = obj
  }

  return {
    data,
    extra,
  }
}

export const capturePersonal = (
  event: IncomingEvent,
  isPHI?: boolean,
  options?: EventOptions
): void => {
  if (!event) {
    return
  }

  const data = createPersonalEvent(event, isPHI)
  if (!data) {
    return
  }

  internalUtils.sendEvent([data], options)
}
