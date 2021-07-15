import {
  init as initMethod,
  capture as captureMethod,
  pageView as pageViewMethod,
  getUserId as getUIDMethod,
  enable as enableMethod,
  defaultEventData as defaultEventDataMethod,
  isEnabled as isEnabledMethod,
} from '@blotoutio/sdk-core'

import {
  mapID as mapIDMethod,
  transaction as transactionMethod,
} from '@blotoutio/sdk-events'

/* #if _FEATURES !== 'full'
// #else */
import { capturePersonal as capturePersonalMethod } from '@blotoutio/sdk-personal'
// #endif

class API {
  init(preferences) {
    initMethod(preferences)
  }

  capture(eventName, additionalData, options) {
    captureMethod(eventName, additionalData, options)
  }

  /* #if _FEATURES !== 'full'
  // #else */
  capturePersonal(eventName, additionalData, isPHI, options) {
    capturePersonalMethod(eventName, additionalData, isPHI, options)
  }
  // #endif

  pageView(previousUrl, additionalData) {
    pageViewMethod(previousUrl, additionalData)
  }

  getUserId() {
    return getUIDMethod()
  }

  enable(enable) {
    enableMethod(enable)
  }

  defaultEventData(types, additionalData) {
    defaultEventDataMethod(types, additionalData)
  }

  isEnabled() {
    return isEnabledMethod()
  }

  /*
    Defined events
   */
  mapID(mapIDData, additionalData, options) {
    mapIDMethod(mapIDData, additionalData, options)
  }

  transaction(transactionData, additionalData, options) {
    transactionMethod(transactionData, additionalData, options)
  }
}

export default new API()
