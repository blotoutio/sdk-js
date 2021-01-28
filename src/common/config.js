export const callInterval = 3600000
export const constants = {
  EVENT_CATEGORY: 10001,
  EVENT_DEV_CATEGORY: 20001,
  UID: 'uid',
  MOBILE_PLATFORM_CODE: 16,
  WEB_PLATFORM_CODE: 70,
  EVENT_PATH: 'Event_Path',
  EVENT_PUSH_INTERVAL: 'Event_Push_Interval',
  DEFAULT_EVENT_PUSH_INTERVAL: 1,
  SESSION_ID: 'sessionId',
  MANIFEST_REFRESH_INTERVAL: 'Manifest_Refresh_Interval',
  API_ENDPOINT: 'Api_Endpoint',
  ROOT_KEY: 'Root',
  DOMAINS: 'domains',
  BOUNCE: 'bounce',
  SESSION: 'session',
  MAILER: 'mailer',
  NAVIGATION: 'navigation',
  LICENSE_EXPIRE_DAY_ALIVE: 'License_Expire_Day_Alive',
  DEFAULT_LICENSE_EXPIRE_DAY_ALIVE: 30,
  EVENT_DEVICEINFO_GRAIN: 'Event_Deviceinfo_Grain',
  DEFAULT_EVENT_DEVICEINFO_GRAIN: 1,
  EVENT_CODIFIED_MERGECOUNTER: 'Event_Codified_Mergecounter',
  DEFAULT_EVENT_CODIFIED_MERGECOUNTER: 1,
  EVENT_SYSTEM_MERGECOUNTER: 'Event_System_Mergecounter',
  DEFAULT_EVENT_SYSTEM_MERGECOUNTER: '1',
  EVENT_PUSH_EVENTSCOUNTER: 'Event_Push_Eventscounter',
  DEFAULT_EVENT_PUSH_EVENTSCOUNTER: '15',
  STORE_EVENTS_INTERVAL: 'Store_Events_Interval',
  DEFAULT_STORE_EVENTS_INTERVAL: 1,
  DOM_SUB_TREE_MODIFIED_INTERVAL: 1800000,
  PHI_PUBLIC_KEY: 'PHI_Public_Key',
  PII_PUBLIC_KEY: 'PII_Public_Key',
  SESSION_START_TIME: 'session_start_time',
  SESSION_INFO: 'Session Info',
  CUSTOM_EVENT_STORAGE: 'EventsSubCode',
  DEVELOPER_EVENT_CUSTOM: 21100,
  MAP_ID_EVENT: 'map_id',
  MAP_ID_EVENT_CODE: 21001,
  PUSH_SYSTEM_EVENTS: 'SDK_Push_System_Events',
  DEFAULT_PUSH_SYSTEM_EVENTS: false,
}
export const manifestConst = {
  EVENT_PATH: 'v1/events/publish',
  MANIFEST_PATH: 'v1/manifest/pull',
}
export const systemEventCode = {
  cut: 11101,
  copy: 11102,
  paste: 11103,
  dragstart: 11104,
  dragend: 11105,
  unload: 11106,
  load: 11107,
  error: 11108,
  abort: 11109,
  help: 11110,
  search: 11111,
  DOMActivate: 11112,
  blur: 11113,
  focus: 11114,
  DOMSubtreeModified: 11115,
  reset: 11116,
  submit: 11117,
  keypress: 11118,
  click: 11119,
  dblclick: 11120,
  contextmenu: 11121,
  offline: 11122,
  online: 11123,
  afterprint: 11124,
  touchend: 11125,
  hashchange: 11126,
  resize: 11127,
  referrer: 11501,
  dnt: 11502,
  bounce: 11504,
  navigation: 11505,
  mailer: 11506,
  session: 11507,
  hover: 11508,
  hoverc: 11509,
  scroll: 11129,
  sessionInfo: 11024,
  sdk_start: 11130,
}
export const isDevMode = process.env.NODE_ENV === 'development'
export const isHighFreqEventOff = true
export const highFreqEvents = [
  'DOMActivate',
  'DOMSubtreeModified',
  'focus',
  'blur',
  'keypress',
  'hoverc',
  'touchend',
]
export const dataEncryptionEnabled = true
