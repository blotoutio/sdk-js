export const constants = {
  MOBILE_PLATFORM_CODE: 16,
  WEB_PLATFORM_CODE: 70,
  DEFAULT_STORAGE_KEY: 'trends',
  DOM_SUB_TREE_MODIFIED_INTERVAL: 1800000,
  DEVELOPER_EVENT_CUSTOM: 21100,
  MAP_ID_EVENT: 'map_id',
  MAP_ID_EVENT_CODE: 21001,
  SCROLL_INTERVAL: 2000,
  MANIFEST_PATH: 'v1/manifest/pull',
  SDK_START: 'sdk_start',
  VISIBILITY_VISIBLE: 'visibility_visible',
  VISIBILITY_HIDDEN: 'visibility_hidden',
}
export const systemEventCode: Record<string, number> = {
  cut: 11101,
  copy: 11102,
  paste: 11103,
  dragstart: 11104,
  dragend: 11105,
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
  session: 11507,
  hover: 11508,
  scroll: 11129,
  sessionInfo: 11024,
  sdk_start: 11130,
  visibilityVisible: 11131,
  visibilityHidden: 11132,
}
export const isDevMode = process.env.NODE_ENV === 'development'
export const isHighFreqEventOff = true
export const highFreqEvents = [
  'DOMActivate',
  'DOMSubtreeModified',
  'focus',
  'blur',
  'keypress',
  'touchend',
]
