import {
  setEvent,
  setDNTEvent,
  updateSessionEndTime,
  updateNavPath,
  updateNavTime,
  setViewPort
} from '../common/sessionUtil'
import { getSessionData, getEventsSDKDataForDate } from '../common/storageUtil'
import { debounce, collectEvent, sendBounceEvent, getDate, detectQueryString } from '../utils'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'

export const resize = (window) => {
  const eventName = 'resize'
  window.addEventListener(eventName, debounce((e) => {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, e, {})
        setViewPort()
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  }, 3000))
}

export const unload = (window) => {
  const eventName = 'unload'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      updateNavTime()
      updateNavPath()

      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, e)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}

export const load = (window) => {
  const eventName = 'load'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, e)

        const sessionId = getSessionData(constants.SESSION_ID)
        const sdkDataForDate = getEventsSDKDataForDate(getDate())
        const sessionIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
          .findIndex((obj) => obj.name === constants.SESSION)
        if (sessionIndex === -1) {
          setEvent(constants.SESSION, e)
        }

        const mailerIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
          .findIndex((obj) => obj.name === constants.MAILER)
        if (detectQueryString() && mailerIndex === -1) {
          setEvent(constants.MAILER, e)
        }
      }

      if (
        window.doNotTrack ||
      navigator.doNotTrack ||
      navigator.msDoNotTrack ||
      (window.external && 'msTrackingProtectionEnabled' in window.external)
      ) {
      // The browser supports Do Not Track!
        if (
          window.doNotTrack === '1' ||
        navigator.doNotTrack === 'yes' ||
        navigator.doNotTrack === '1' ||
        navigator.msDoNotTrack === '1' ||
        (window.external.msTrackingProtectionEnabled && window.external.msTrackingProtectionEnabled())
        ) {
        // Do Not Track is enabled!
          setDNTEvent('dnt', e, {})
        }
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}

export const beforeUnload = (window) => {
  window.addEventListener('beforeunload', function (e) {
    if (!isSysEvtStore) {
      return
    }

    updateSessionEndTime()
    if (!getSessionData(constants.SESSION_ID)) {
      return
    }

    const date = getDate()
    const sdkDataForDate = getEventsSDKDataForDate(date)
    const sessionId = getSessionData(constants.SESSION_ID)
    const bncIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
      .findIndex((obj) => obj.name === constants.BOUNCE)
    const startTime = sdkDataForDate.sessions[sessionId].startTime
    const diffTime = Date.now() - startTime
    const diffTimeInSecs = Math.floor(diffTime / 1000)
    const clkIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
      .findIndex((obj) => obj.name === 'click')
    if (diffTimeInSecs <= 5 && clkIndex === -1) {
      if (bncIndex === -1) {
        setEvent(constants.BOUNCE, e)
        sendBounceEvent(date)
      }
    }
  })
}

export const domSubTreeModified = (window) => {
  const eventName = 'DOMSubtreeModified'
  window.addEventListener(eventName, debounce((event) => {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, event)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  }, constants.DOM_SUB_TREE_MODIFIED_INTERVAL))
}

export const domActive = (window) => {
  const eventName = 'DOMActivate'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, e)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}