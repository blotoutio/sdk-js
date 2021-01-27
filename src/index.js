import { constants } from './config'
import { getTempUseValue } from './storage/sharedPreferences'
import { setDevEvent } from './event/session'
import { setSessionPHIEvent, setSessionPIIEvent } from './session/personal'
import { mapIDEvent } from './event'
import { init } from './common/init'
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

  SDK.prototype.logEvent = (eventName, data = null) => {
    setDevEvent(eventName, data)
  }

  SDK.prototype.init = (preferences) => {
    init(preferences)
  }

  SDK.prototype.getUserId = () => {
    return getTempUseValue(constants.UID)
  }

  SDK.prototype.logPIIEvent = (eventName, data = null) => {
    setSessionPIIEvent(eventName, data)
  }

  SDK.prototype.logPHIEvent = (eventName, data = null) => {
    setSessionPHIEvent(eventName, data)
  }

  SDK.prototype.mapID = (id, provider, data = null) => {
    mapIDEvent(id, provider, data)
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
