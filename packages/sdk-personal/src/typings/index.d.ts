import { EventOptions, EventData } from '@blotoutio/sdk-core'

export declare const capturePersonal: (
  eventName: string,
  data: EventData,
  isPHI?: boolean,
  options?: EventOptions
) => void
