import {
  init as initMethod,
  capture as captureMethod,
  pageView as pageViewMethod,
  mapID as mapIDMethod,
  getUserId as getUIDMethod,
  enable as enableMethod,
} from '@blotoutio/sdk-core'

/* #if _FEATURES !== 'full'
// #else */
import { capturePersonal as capturePersonalMethod } from '@blotoutio/sdk-personal'
// #endif

class API {
  init(preferences) {
    initMethod(preferences)
  }

  capture(event, data, options) {
    captureMethod(event, data, options)
  }

  /* #if _FEATURES !== 'full'
  // #else */
  capturePersonal(event, data, isPHI, options) {
    capturePersonalMethod({ name: event, data, options }, isPHI, options)
  }
  // #endif

  pageView(previousUrl) {
    pageViewMethod(previousUrl)
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
}

export default new API()
