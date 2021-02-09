import { mapID, pageView, setDevEvent } from '../event'
import { init } from './init'
import { getUID } from './uidUtil'

class API {
  capture(event: string, data?: EventData, options?: EventOptions) {
    setDevEvent([{ name: event, data, options }], options)
  }

  init(preferences: InitPreferences) {
    init(preferences)
  }

  getUserId() {
    return getUID()
  }

  mapID(
    id: string,
    provider: string,
    data?: EventData,
    options?: EventOptions
  ) {
    mapID(id, provider, data, options)
  }

  pageView() {
    pageView()
  }
}

export default new API()
