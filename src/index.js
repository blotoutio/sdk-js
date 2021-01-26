import { requiredEvents, optionalEvents } from './event/system'
import { setInitialConfiguration, initialize } from './utils'
import { setUrl } from './common/endPointUrlUtil'
import * as log from './common/logUtil'
import { constants } from './config'
import { getTempUseValue, setTempUseValue } from './storage/sharedPreferences'
import { setDevEvent, setEndDevEvent, setStartDevEvent } from './event/session'
import { setSessionPHIEvent, setSessionPIIEvent } from './session/personal'
import {
  pullManifest,
  updateManifest,
  checkManifest,
  checkUpdateForManifest,
} from './manifest'
import { setRetentionData, syncData } from './retention'
import { setReferrer } from './common/referrerUtil'
import { setGeoDetails } from './common/geoUtil'
import { mapIDEvent, sendStartEvent } from './event'
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
    if (!preferences) {
      return
    }

    setUrl(preferences.endpointUrl)
    setInitialConfiguration(preferences)
    initialize(false)
    setTempUseValue(constants.SDK_TOKEN, preferences.token)
    setReferrer()

    sendStartEvent()
    requiredEvents(window)

    if (!checkManifest()) {
      pullManifest()
        .then(() => {
          setRetentionData()
          setGeoDetails()
          syncData()
          optionalEvents(window)
        })
        .catch(log.error)
    } else {
      if (checkUpdateForManifest()) {
        updateManifest()
      }

      setGeoDetails()
      setRetentionData()
      optionalEvents(window)
    }
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
