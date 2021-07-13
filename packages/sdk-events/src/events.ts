import {
  EventOptions,
  EventData,
  internalUtils,
  SendEvent,
} from '@blotoutio/sdk-core'
import { constants } from './constants'
import { MapIDData } from './typings'

const createEvent = (
  name: string,
  code: number,
  eventData: EventData,
  additionalData: EventData = {}
): SendEvent => {
  const data = internalUtils.createBasicEvent({
    name,
    code,
  })

  return {
    type: 'codified',
    data,
    extra: {
      ...additionalData,
      ...eventData,
    },
  }
}

export const mapID = (
  mapIDData: MapIDData,
  additionalData?: EventData,
  options?: EventOptions
): void => {
  if (!mapIDData || !mapIDData.externalID) {
    internalUtils.error('ID mapping is missing id')
    return
  }

  if (!mapIDData.provider) {
    internalUtils.error('ID mapping is missing provider')
    return
  }

  const eventData = {
    map_id: mapIDData.externalID,
    map_provider: mapIDData.provider,
  }

  const event = createEvent(
    constants.MAP_ID_EVENT,
    constants.MAP_ID_EVENT_CODE,
    eventData,
    additionalData
  )

  internalUtils.sendEvent([event], options)
}
