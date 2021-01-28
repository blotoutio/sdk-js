import { setDevEvent, setEvent } from './session'
import { getEventPayload } from './utils'
import { constants } from '../common/config'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getVariable } from '../common/manifest'
import { encryptRSA } from '../common/securityUtil'
import { getPayload } from '../common/payloadUtil'

export const sendPIIPHIEvent = (events, isPII) => {
  if (events && events.length === 0) {
    return
  }

  const key = isPII ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const eventsArr = getEventPayload(events)
  const publicKey = getVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify(eventsArr))

  const payload = getPayload(events)

  if (isPII) {
    payload.pii = obj
  } else {
    payload.phi = obj
  }

  postRequest(getManifestUrl(), JSON.stringify(payload)).catch(error)
}

export const mapIDEvent = (id, provider, data) => {
  if (!id) {
    error('ID mapping is missing id')
    return
  }

  if (!data) {
    data = {}
  }

  data.map_id = id
  data.map_provider = provider

  setDevEvent(constants.MAP_ID_EVENT, data, constants.MAP_ID_EVENT_CODE)
}

export const sendStartEvent = () => {
  setEvent('sdk_start')
}
