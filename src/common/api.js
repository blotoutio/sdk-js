import { mapID, setDevEvent } from '../event'
import { init } from './init'
import { getUID } from './uidUtil'

const SDK = function () {}

SDK.prototype.capture = (event, data = null, options = null) => {
  setDevEvent([{ name: event, data, options }], options)
}

SDK.prototype.init = (preferences) => {
  init(preferences)
}

SDK.prototype.getUserId = () => {
  return getUID()
}

SDK.prototype.mapID = (id, provider, data = null) => {
  mapID(id, provider, data)
}

export default new SDK()
