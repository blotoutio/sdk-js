import { mapID as mapIDMethod } from './events'
import { EventOptions, EventData, isEnabled } from '@blotoutio/sdk-core'
import { MapIDData } from './typings'

export const mapID = (
  mapIDData: MapIDData,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  mapIDMethod(mapIDData, data, options)
}
