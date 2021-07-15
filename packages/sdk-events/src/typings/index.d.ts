import { EventOptions, EventData } from '@blotoutio/sdk-core'

type EventType = 'mapID'

interface Field {
  required: boolean
  key: string
}

interface Event<T> {
  name: string
  code: number
  fields: Record<keyof T, Field>
}

interface MapIDData {
  externalID: string
  provider: string
}

export declare const mapID: (
  data: MapIDData,
  additionalData?: EventData,
  options?: EventOptions
) => void
