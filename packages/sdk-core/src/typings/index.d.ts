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
  customDomain?: string
  storageRootKey?: string
}

interface AdditionalData {
  position?: Position
  obj?: string
  objT?: string
  mouse?: MouseData
  [key: string]: unknown
}

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
  additionalData?: AdditionalData
}

interface SendEvent {
  data: BasicEvent
  extra?: AdditionalData
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
  sendEvent: (events: SendEvent[], options?: EventOptions) => void
  getVariable: (key: keyof Manifest) => string | number | boolean
  createBasicEvent: (event: IncomingEvent) => BasicEvent
}
