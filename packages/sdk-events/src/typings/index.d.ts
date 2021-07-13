import { EventOptions, EventData } from '@blotoutio/sdk-core'

interface MapIDData {
  externalID: string
  provider: string
}

export declare const mapID: (
  data: MapIDData,
  additionalData?: EventData,
  options?: EventOptions
) => void
