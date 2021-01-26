import { constants } from './config'
import { getTempUseValue } from './storage/sharedPreferences'
import { setDevEvent, setEndDevEvent, setStartDevEvent } from './event/session'
import { setSessionPHIEvent, setSessionPIIEvent } from './session/personal'
import { mapIDEvent } from './event'
import { init } from './common/init'
;(function (window) {
  const SDK = function () {}

  SDK.prototype.logEvent = function (eventName, data = null) {
    setDevEvent(eventName, data)
  }

  SDK.prototype.startTimedEvent = function (eventName, data = null) {
    setStartDevEvent(eventName, data)
  }

  SDK.prototype.endTimedEvent = function (eventName) {
    setEndDevEvent(eventName)
  }

  SDK.prototype.init = function (preferences) {
    init(preferences)
  }

  SDK.prototype.getUserId = function () {
    return getTempUseValue(constants.UID)
  }

  SDK.prototype.logPIIEvent = function (eventName, data = null) {
    setSessionPIIEvent(eventName, data)
  }

  SDK.prototype.logPHIEvent = function (eventName, data = null) {
    setSessionPHIEvent(eventName, data)
  }

  SDK.prototype.mapID = function (id, provider, data = null) {
    mapIDEvent(id, provider, data)
  }

  window.bojs = new SDK()
})(window)
