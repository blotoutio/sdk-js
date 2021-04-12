interface ServerVariable {
  value: string
  variableDataType: number
  variableId: number
}

interface ServerManifest {
  variables: ServerVariable[]
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
  osn?: string
}

interface RequestRetry {
  url: string
  payload: string
}

interface SessionData {
  referrer: string
  search: Record<string, string>
  manifest?: Manifest
  retries?: RequestRetry[]
  enabled?: string
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
  fetch: {
    mockResolvedValueOnce
  }
}
