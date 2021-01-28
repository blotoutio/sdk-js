/**
 * @description
 * Define local storage object.
 */
export interface Root {
  domains: string[]
  [key: string]: Storage | string[]
}

export interface Storage {
  sharedPreference: SharedPreference
  manifest: Manifest
  events: {
    [key: string]: DateObject
  }
}

export interface SharedPreference {
  tempUse: TempUse
  normalUse: object
  customUse: object
}

export interface Manifest {
  createdDate: number // timestamp (1609759019141)
  modifiedDate: number // timestamp (1609759019141)
  manifestData: {
    [key: string]: Variables
  }
}

export interface DateObject {
  isSynced: boolean
  sdkData: SdkData
}

export interface TempUse {
  uid: string // 0bb1ca394c488cf4-7304296f-e34fcb6a-84d721e4-bf60f032551818f9d7dbaa40
  sdkToken: string // YJ9NSY556HG9YSK
}

export interface Variables {
  [index: number]: Variable
}

export interface SdkData {
  date: string // 4-1-2021
  domain: string // www.localhost.com
  sessions: {
    [key: string]: Sessions
  }
}

export interface CommonMeta {
  plf: number
  osv: string // OS version (10.14.6)
  dplatform: string // Device platform
}

export interface Variable {
  description: string
  variableId: number
  value: string
  variableDataType: number
  variableName: string
  isEditable: boolean
}

export interface Sessions {
  startTime: number
  endTime: number
  lastServerSyncTime: number
  sdkVersion: string
  meta: Meta
  viewPort: {
    [key: number]: ViewPort
  }
  eventsData: {
    eventsInfo: {
      [index: number]: Info
    }
    devCodifiedEventsInfo: {
      [index: number]: DevEventInfo
    }
    sentToServer: boolean
  }
}

export interface CommonInfo {
  sentToServer: boolean
  objectName: string
  name: string
  urlPath: string
  tstmp: number
  mid: string
  nmo: number
  evcs: number
  metaInfo: object
}

export interface Info extends CommonInfo {
  position: Position
  objectTitle: string
  extraInfo: object
}

export interface DevEventInfo extends CommonInfo {
  duration?: number
  isPii?: boolean
  isPhi?: boolean
}

export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export interface ViewPort {
  timeStamp: number
  width: number
  height: number
  docHeight: number
  docWidth: number
}

export interface Meta extends CommonMeta {
  domain: string
  hostOS: string // OS name (Mac OS)
  browser: string // Browser name (Chrome)
  version: string // Browser version (87.0.4280.88)
  ua: string // User agent
}
