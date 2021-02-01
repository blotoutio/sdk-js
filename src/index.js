import { mapID, setDevEvent } from './event'
import { init } from './common/init'
import { getUID } from './common/uidUtil'
;(function () {
  const handleFunction = (arg) => {
    const sliced = [].slice.call(arg)
    if (!Array.isArray(sliced) || sliced.length === 0) {
      return
    }

    try {
      return library[sliced[0]](...sliced.slice(1))
    } catch (e) {
      console.error(e)
    }
  }

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

  let stubs = []
  if (window.trends) {
    stubs = window.trends.stubs || []
  }

  const library = new SDK()
  // this needs to be regular function for arguments to work
  window.trends = function () {
    return handleFunction(arguments)
  }

  // restore calls that were triggered before lib was ready
  stubs.forEach(handleFunction)
})()
