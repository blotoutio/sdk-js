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
  const basicEvent = internalUtils.createBasicEvent(event)
  if (!basicEvent) {
    return null
  }

  const key = isPHI ? 'phiPublicKey' : 'piiPublicKey'
  const publicKey = (internalUtils.getVariable(key) || '').toString()
  const obj = encryptRSA(publicKey, JSON.stringify([event.data]))

  return {
    type: isPHI ? 'phi' : 'pii',
    data: basicEvent,
    extra: { ...obj },
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
