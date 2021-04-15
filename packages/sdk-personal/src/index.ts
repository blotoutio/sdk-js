import {
  EventOptions,
  IncomingEvent,
  internalUtils,
  SendEvent,
  EventData,
} from '@blotoutio/sdk-core'
import { encryptRSA } from './security'

const createPersonalEvent = (
  event: IncomingEvent,
  isPHI: boolean
): SendEvent => {
  const basicEvent = internalUtils.createBasicEvent(event)
  const key = isPHI ? 'phiPublicKey' : 'piiPublicKey'
  const publicKey = (internalUtils.getVariable(key) || '').toString()
  const obj = encryptRSA(publicKey, JSON.stringify([event.data]))

  if (!obj) {
    return null
  }

  return {
    type: isPHI ? 'phi' : 'pii',
    data: basicEvent,
    extra: { ...obj },
  }
}

export const capturePersonal = (
  eventName: string,
  data: EventData,
  isPHI?: boolean,
  options?: EventOptions
): void => {
  if (!eventName) {
    return
  }

  const eventData = createPersonalEvent(
    { name: eventName, data, options },
    isPHI
  )

  if (!eventData) {
    return
  }

  internalUtils.sendEvent([eventData], options)
}
