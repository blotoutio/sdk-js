import { createDevEvent } from '../event/create'
import { getEventPayload, sendEvent } from '../event/utils'
import { getVariable } from '../common/manifest'
import { encryptRSA } from './security'

const createPersonalEvent = (
  event: IncomingEvent,
  isPHI: boolean
): SendEvent => {
  const data = createDevEvent(event)
  if (!data) {
    return null
  }
  const key = isPHI ? 'phiPublicKey' : 'piiPublicKey'
  const eventPayload = getEventPayload(data)
  const publicKey = (getVariable(key) || '').toString()
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
): false | null | SendEvent => {
  if (!event) {
    return
  }

  const data = createPersonalEvent(event, isPHI)
  if (!data) {
    return
  }

  sendEvent([data], options)
}
