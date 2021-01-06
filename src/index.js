import { startEvents } from './event/system'
import { setInitialConfiguration, initialize } from './utils'
import { setUrl } from './common/endPointUrlUtil'
import * as log from './common/logUtil'
import { constants, isDevEvtCollect, isDevEvtStore } from './config'
import { setLocal } from './storage'
import { getTempUseValue, setTempUseValue } from './storage/sharedPreferences'
import { setDevEvent, setEndDevEvent, setStartDevEvent } from './event/session'
import { setSessionPHIEvent, setSessionPIIEvent } from './session/personal'
import { pullManifest, updateManifest, checkManifest } from './manifest'
import { checkUpdateForManifest, setRetentionData } from './retention'
import { setReferrer } from './common/referrerUtil'
import { setGeoDetails, checkGeo } from './common/geoUtil'
import { collectEvent, mapIDEvent } from './event'

(function (window) {
  const SDK = function () {}

  SDK.prototype.logEvent = function (eventName, data = null, objectName = null) {
    if (isDevEvtStore) {
      setDevEvent(eventName, data, objectName)
      return
    }

    if (isDevEvtCollect) {
      collectEvent(eventName, {}, constants.DEV_EVENT)
    }
  }

  SDK.prototype.startTimedEvent = function (eventName, data = null, objectName = null) {
    setStartDevEvent(eventName, objectName, data)
  }

  SDK.prototype.endTimedEvent = function (eventName) {
    if (isDevEvtStore) {
      setEndDevEvent(eventName)
      return
    }

    if (isDevEvtCollect) {
      collectEvent(eventName, {}, constants.DEV_EVENT)
    }
  }

  SDK.prototype.init = function (preferences) {
    if (!preferences) {
      return
    }

    setUrl(preferences.endpointUrl)
    setInitialConfiguration(preferences)
    initialize(false)
    setRetentionData()

    setTempUseValue(constants.SDK_TOKEN, preferences.token)
    if (!checkManifest()) {
      pullManifest()
        .then(() => {})
        .catch(function (error) {
          log.error(error)
        })
    } else {
      if (checkUpdateForManifest()) {
        updateManifest()
      }
    }

    if (!checkGeo()) {
      setGeoDetails()
    }

    const ref = document.referrer
    if (ref) {
      setReferrer(ref)
    }

    startEvents(window)
  }

  SDK.prototype.setPayingUser = function () {
    setLocal(constants.IS_PAYING_USER, true)
  }

  SDK.prototype.getUserId = function () {
    return getTempUseValue(constants.UID)
  }

  SDK.prototype.logPIIEvent = function (eventName, data = null, objectName = null) {
    if (isDevEvtStore) {
      setSessionPIIEvent(eventName, objectName, data)
      return
    }

    if (isDevEvtCollect) {
      collectEvent(eventName, {}, constants.DEV_EVENT)
    }
  }

  SDK.prototype.logPHIEvent = function (eventName, data = null, objectName = null) {
    if (isDevEvtStore) {
      setSessionPHIEvent(eventName, objectName, data)
      return
    }

    if (isDevEvtCollect) {
      collectEvent(eventName, {}, constants.DEV_EVENT)
    }
  }

  SDK.prototype.mapID = function (id, provider, data = null) {
    mapIDEvent(id, provider, data)
  }

  window.bojs = new SDK()
})(window)
