import { mapID, pageView, setDevEvent } from '../event'
import { init } from './init'
import { getUID } from './uidUtil'

/* #if _FEATURES !== 'full'
// #else */
import { capturePersonal as personal } from '../personal'
// #endif

class API {
  init(preferences: InitPreferences) {
    init(preferences)
  }

  capture(event: string, data?: EventData, options?: EventOptions) {
    setDevEvent([{ name: event, data, options }], options)
  }

  /* #if _FEATURES !== 'full'
  // #else */
  capturePersonal(
    event: string,
    data?: EventData,
    isPHI?: boolean,
    options?: EventOptions
  ) {
    personal({ name: event, data, options }, isPHI, options)
  }
  // #endif

  pageView() {
    pageView()
  }

  mapID(
    id: string,
    provider: string,
    data?: EventData,
    options?: EventOptions
  ) {
    mapID(id, provider, data, options)
  }

  getUserId() {
    return getUID()
  }
}

export default new API()
