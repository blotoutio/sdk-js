import { createDevEvent } from '../event/create'
import { getEventPayload } from '../event/utils'
import { getVariable } from '../common/manifest'
import { encryptRSA } from './security'

const createPersonalEvent = (event: IncomingEvent): SendEvent => {
  if (!event.name) {
    return null
  }

  const data = createDevEvent(event)
  if (!data) {
    return null
  }
  const key = event.options.PII ? 'piiPublicKey' : 'phiPublicKey'
  const eventPayload = getEventPayload(data)
  const publicKey = (getVariable(key) || '').toString()
  const obj = encryptRSA(publicKey, JSON.stringify([eventPayload]))
  data.metaInfo = null

  const extra: SendEventExtra = {}
  if (event.options.PII) {
    extra.pii = obj
  } else {
    extra.phi = obj
  }

  return {
    data,
    extra,
  }
}

export const handlePersonalEvent = (
  event: IncomingEvent
): false | null | SendEvent => {
  if (!event.options || (!event.options.PII && !event.options.PHI)) {
    return false
  }

  const data = createPersonalEvent(event)
  if (!data) {
    return null
  }

  return data
}
