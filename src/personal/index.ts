import { createDevEvent } from '../event/create'
import { getEventPayload, sendEvent } from '../event/utils'
import { getVariable } from '../common/manifest'
import { encryptRSA } from './security'

const createPersonalEvent = (event: IncomingPersonal): SendEvent => {
  const data = createDevEvent(event)
  if (!data) {
    return null
  }
  const isPHI = event.options && event.options.PHI
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
  event: IncomingPersonal,
  options?: PersonalOptions
): false | null | SendEvent => {
  if (!event) {
    return
  }

  const data = createPersonalEvent(event)
  if (!data) {
    return
  }

  sendEvent([data], options)
}
