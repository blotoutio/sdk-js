export const constants = {
  MOBILE_PLATFORM_CODE: 16,
  WEB_PLATFORM_CODE: 70,
  DEFAULT_STORAGE_KEY: 'trends',
  DOM_SUB_TREE_MODIFIED_INTERVAL: 1800000,
  DEVELOPER_EVENT_CUSTOM: 21100,
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
  error: 11106,
  help: 11107,
  blur: 11108,
  focus: 11109,
  reset: 11110,
  submit: 11111,
  keypress: 11112,
  dblclick: 11113,
  contextmenu: 11114,
  offline: 11115,
  online: 11116,
  afterprint: 11117,
  touchend: 11118,
  click: 11119,
  hashchange: 11120,
  resize: 11121,
  scroll: 11122,
  hover: 11123,
  sdk_start: 11130,
  visibility_visible: 11131,
  visibility_hidden: 11132,
}
export const isDevMode = process.env.NODE_ENV === 'development'
