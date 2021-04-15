import {
  init as initMethod,
  capture as captureMethod,
  pageView as pageViewMethod,
  mapID as mapIDMethod,
  getUserId as getUIDMethod,
  enable as enableMethod,
  defaultEventData as defaultEventDataMethod,
} from '@blotoutio/sdk-core'

/* #if _FEATURES !== 'full'
// #else */
import { capturePersonal as capturePersonalMethod } from '@blotoutio/sdk-personal'
// #endif

class API {
  init(preferences) {
    initMethod(preferences)
  }

  capture(eventName, data, options) {
    captureMethod(eventName, data, options)
  }

  /* #if _FEATURES !== 'full'
  // #else */
  capturePersonal(eventName, data, isPHI, options) {
    capturePersonalMethod(eventName, data, isPHI, options)
  }
  // #endif

  pageView(previousUrl, data) {
    pageViewMethod(previousUrl, data)
  }

  mapID(id, provider, data, options) {
    mapIDMethod(id, provider, data, options)
  }

  getUserId() {
    return getUIDMethod()
  }

  enable(enable) {
    enableMethod(enable)
  }

  defaultEventData(types, data) {
    defaultEventDataMethod(types, data)
  }
}

export default new API()
