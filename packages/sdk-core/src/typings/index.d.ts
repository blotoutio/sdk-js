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
  metaInfo?: EventData
  position?: Position | null
  objectTitle?: string | null
  mouse?: MouseData
  objectName?: string
}

interface EventPayloadProperties {
  // eslint-disable-next-line camelcase
  session_id: string
  screen: {
    width: number
    height: number
    docHeight: number
    docWidth: number
  }
  position?: Position
  obj?: string
  objT?: string
  mouse?: MouseData
  codifiedInfo?: EventData
}

interface EventOptions {
  method?: 'beacon'
}

interface InitPreferences {
  endpointUrl: string
  token: string
  customDomain?: string
  storageRootKey?: string
}

interface EventPayload {
  mid: string
  userid: string
  evn: string
  evcs: number
  scrn: string
  evt: number
  properties: EventPayloadProperties
}

interface SendEvent {
  data: BasicEvent
  extra?: unknown
}

interface Manifest {
  deviceInfoGrain: number
  eventPath: string
  pushSystemEvents: number
  phiPublicKey?: string
  piiPublicKey?: string
  endPoint?: string
}

interface IncomingEvent {
  name: string
  data?: EventData
  code?: number
  options?: EventOptions
  objectName?: string
  event?: MouseEvent
  url?: string
}

export declare const capture: (
  event: string,
  data?: EventData,
  options?: EventOptions
) => void
export declare const init: (preferences: InitPreferences) => void
export declare const getUserId: () => string
export declare const mapID: (
  id: string,
  provider: string,
  data?: EventData,
  options?: EventOptions
) => void
export declare const pageView: (previousUrl: string) => void
export declare const internalUtils: {
  getEventPayload: (event: BasicEvent) => EventPayload
  sendEvent: (events: SendEvent[], options?: EventOptions) => void
  getVariable: (key: keyof Manifest) => string | number | boolean
  createEvent: (event: IncomingEvent) => BasicEvent
}
