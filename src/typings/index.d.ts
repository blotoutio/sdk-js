interface InitPreferences {
  endpointUrl: string
  token: string
  customDomain?: string
  storageRootKey?: string
}

interface ServerVariable {
  value: string
  variableDataType: number
  variableId: number
}

interface ServerManifest {
  variables: ServerVariable[]
}

interface EventOptions {
  method?: 'beacon'
}

interface PersonalOptions extends EventOptions {
  PII?: boolean
  PHI?: boolean
}

interface EventData {
  [key: string]: unknown
}

interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface IncomingEvent {
  name: string
  data: EventData
  code?: number
  options?: EventOptions
}

interface IncomingPersonal extends IncomingEvent {
  options?: PersonalOptions
}

interface BasicEvent {
  name: string
  urlPath: string
  tstmp: number
  mid: string
  evcs: number
}

interface DevEvent extends BasicEvent {
  metaInfo?: EventData
}

interface MouseData {
  x: number
  y: number
}

interface SystemEvent extends BasicEvent {
  position?: Position | null
  objectTitle?: string | null
  mouse?: MouseData
  objectName?: string
}

interface PersonalData {
  data: string
  iv: string
  key: string
}

interface SendEventExtra {
  pii?: PersonalData
  phi?: PersonalData
}

interface SendEvent {
  data: DevEvent
  extra?: SendEventExtra
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

interface EventPayload {
  mid: string
  userid: string
  evn: string
  evcs: number
  scrn: string
  evt: number
  properties: EventPayloadProperties
}

interface Meta {
  sdkv: string
  // eslint-disable-next-line camelcase
  tz_offset: number
  // eslint-disable-next-line camelcase
  user_id_created?: number
  referrer?: string
  search?: Record<string, string>
  plf?: number
  appn?: string
  osv?: string
  appv?: string
  dmft?: string
  dm?: string
  bnme?: string
  dplatform?: string
  osn?: string
}

interface RequestRetry {
  url: string
  payload: string
}

interface Manifest {
  deviceInfoGrain: number
  eventPath: string
  phiPublicKey?: string
  piiPublicKey?: string
  pushSystemEvents: number
}

interface SessionData {
  referrer: string
  search: Record<string, string>
  manifest?: Manifest
  retries?: RequestRetry[]
}

interface Payload {
  meta: Meta
  events?: EventPayload[]
}

interface Navigator {
  brave: unknown
}

interface MouseEvent {
  name: string
}

interface Window {
  trends: {
    (event: 'init', preferences: InitPreferences)
    (event: 'capture', name: string, data?: EventData, options?: EventOptions)
    (
      event: 'capturePersonal',
      name: string,
      data?: EventData,
      options?: PersonalOptions
    )
    (event: 'pageView', options?: EventOptions)
    (event: 'mapID', id: string, provider: string, data?: EventData)
    (event: 'getUserId'): string
  }
  fetch: {
    mockResolvedValueOnce
  }
}

declare module '@blotoutio/jsencrypt-no-random-padding' {
  export class JSEncrypt {
    constructor()
    setPublicKey(pk: string): void
    encrypt(key: string): string
  }
}
