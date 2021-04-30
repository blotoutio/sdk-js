interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface MouseData {
  x: number
  y: number
}

interface EventData {
  [key: string]: unknown
}

interface BasicEvent {
  name: string
  urlPath: string
  tstmp: number
  mid: string
  evcs: number
}

interface EventOptions {
  method?: 'beacon'
}

interface InitPreferences {
  endpointUrl: string
  token: string
  storageRootKey?: string
}

interface AdditionalData {
  position?: Position
  obj?: string
  objT?: string
  mouse?: MouseData
  [key: string]: unknown
}

type EventType = 'system' | 'codified' | 'pii' | 'phi'

interface EventPayload {
  mid: string
  userid: string
  evn: string
  evcs: number
  scrn: string
  evt: number
  // eslint-disable-next-line camelcase
  session_id: string
  screen: {
    width: number
    height: number
    docHeight: number
    docWidth: number
  }
  type: EventType
  additionalData?: AdditionalData
}

interface SendEvent {
  type: EventType
  data: BasicEvent
  extra?: AdditionalData
}

interface Manifest {
  systemEvents?: string[]
  phiPublicKey?: string
  piiPublicKey?: string
}

interface IncomingEvent {
  name: string
  data?: EventData
  code?: number
  options?: EventOptions
  url?: string
}

export declare const init: (preferences: InitPreferences) => void
export declare const capture: (
  eventName: string,
  data?: EventData,
  options?: EventOptions
) => void
export declare const getUserId: () => string
export declare const mapID: (
  id: string,
  provider: string,
  data?: EventData,
  options?: EventOptions
) => void
export declare const pageView: (previousUrl: string, data?: EventData) => void
export declare const enable: (enable: boolean) => void
export declare const defaultEventData: (
  types: EventType[],
  data: EventData
) => void
export declare const internalUtils: {
  sendEvent: (events: SendEvent[], options?: EventOptions) => void
  getVariable: (key: keyof Manifest) => string | number | boolean
  createBasicEvent: (event: IncomingEvent) => BasicEvent
}
