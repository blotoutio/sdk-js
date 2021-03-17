import { EventOptions, IncomingEvent } from '@blotoutio/sdk-core'

export declare const capturePersonal: (
  event: IncomingEvent,
  isPHI?: boolean,
  options?: EventOptions
) => void
