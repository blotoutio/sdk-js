import { startEvents } from './event/system'
import { setInitialConfiguration, initialize } from './utils'
import { setUrl } from './common/endPointUrlUtil'
import * as log from './common/logUtil'
import { constants, isDevEvtCollect, isDevEvtStore } from './config'
import { getSession, setLocal } from './storage'
import { getTempUseValue, setTempUseValue } from './storage/sharedPreferences'
import { setDevEvent, setEndDevEvent, setStartDevEvent } from './event/session'
import { setSessionPHIEvent, setSessionPIIEvent } from './session/personal'
import { pullManifest, updateManifest, checkManifest } from './manifest'
import { checkUpdateForManifest, setRetentionData } from './retention'
import { setReferrer } from './common/referrerUtil'
import { setGeoDetails, checkGeo } from './common/geoUtil'
import { collectEvent } from './event'

(function (window) {
  const SDK = function () {}

  SDK.prototype.logEvent = function (eventName, meta = {}, objectName = '') {
    try {
      if (isDevEvtStore) {
        if (getSession(constants.SESSION_ID)) {
          setDevEvent(eventName, objectName, meta)
        }
        return
      }

      if (isDevEvtCollect) {
        collectEvent(eventName, {}, constants.DEV_EVENT)
      }
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.startTimedEvent = function (eventName, meta = {}, objectName = '') {
    try {
      if (getSession(constants.SESSION_ID)) {
        setStartDevEvent(eventName, objectName, meta)
      }
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.endTimedEvent = function (eventName) {
    try {
      if (isDevEvtStore) {
        if (getSession(constants.SESSION_ID)) {
          setEndDevEvent(eventName)
        }
        return
      }

      if (isDevEvtCollect) {
        collectEvent(eventName, {}, constants.DEV_EVENT)
      }
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.init = function (preferences) {
    if (!preferences) {
      return
    }
    try {
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
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.setPayingUser = function () {
    try {
      setLocal(constants.IS_PAYING_USER, true)
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.getUserId = function () {
    return getTempUseValue(constants.UID)
  }

  SDK.prototype.logPIIEvent = function (eventName, meta = {}, objectName = '') {
    try {
      if (isDevEvtStore) {
        if (getSession(constants.SESSION_ID)) {
          setSessionPIIEvent(eventName, objectName, meta)
        }
        return
      }

      if (isDevEvtCollect) {
        collectEvent(eventName, {}, constants.DEV_EVENT)
      }
    } catch (e) {
      log.error(e)
    }
  }

  SDK.prototype.logPHIEvent = function (eventName, meta = {}, objectName = '') {
    try {
      if (isDevEvtStore) {
        if (getSession(constants.SESSION_ID)) {
          setSessionPHIEvent(eventName, objectName, meta)
        }
        return
      }

      if (isDevEvtCollect) {
        collectEvent(eventName, {}, constants.DEV_EVENT)
      }
    } catch (e) {
      log.error(e)
    }
  }

  window.bojs = new SDK()
})(window)
