import { debounce } from '../../utils'
import { constants } from '../../config'
import { getSession } from '../../storage'
import { getSessionForDate, setEvent } from '../session'
import { setDNTEvent, setViewPort } from '../../session/system'
import { updateNavPath, updateNavTime } from '../../session/navigation'
import { updateEndTime } from '../../session'
import { sendBounceEvent } from '../.'
import { getStringDate } from '../../common/timeUtil'

const detectQueryString = () => {
  const currentUrl = window.location.href
  return (/\?.+=.*/g).test(currentUrl)
}

export const resize = (window) => {
  const eventName = 'resize'
  window.addEventListener(eventName, debounce((e) => {
    setEvent(eventName, e)
    setViewPort()
  }, 3000))
}

export const pagehide = (window) => {
  const eventName = 'onpagehide' in self ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    updateNavTime()
    updateNavPath()
    setEvent(eventName, e)
  })
}

export const load = (window) => {
  const eventName = 'load'
  window.addEventListener(eventName, function (event) {
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
        setDNTEvent(event)
      }
    }

    setEvent(eventName, event)
    const sessionId = getSession(constants.SESSION_ID)
    const session = getSessionForDate(getStringDate(), sessionId)
    if (!session) {
      return
    }
    const sessionIndex = session.eventsData.eventsInfo
      .findIndex((obj) => obj.name === constants.SESSION)
    if (sessionIndex === -1) {
      setEvent(constants.SESSION, event)
    }

    const mailerIndex = session.eventsData.eventsInfo
      .findIndex((obj) => obj.name === constants.MAILER)
    if (detectQueryString() && mailerIndex === -1) {
      setEvent(constants.MAILER, event)
    }
  })
}

export const beforeUnload = (window) => {
  window.addEventListener('beforeunload', function (event) {
    updateEndTime()
    const date = getStringDate()
    const sessionId = getSession(constants.SESSION_ID)
    const session = getSessionForDate(date, sessionId)
    if (!session) {
      return
    }

    const clkIndex = session.eventsData.eventsInfo
    const bncIndex = session.eventsData.eventsInfo
      .findIndex((obj) => obj.name === constants.BOUNCE)
    if (bncIndex !== -1 || clkIndex !== -1) {
      return
    }

    const startTime = session.startTime
    const diffTime = Date.now() - startTime
    const diffTimeInSecs = Math.floor(diffTime / 1000)
      .findIndex((obj) => obj.name === 'click')
    if (diffTimeInSecs <= 2) {
      setEvent(constants.BOUNCE, event)
      sendBounceEvent(date)
    }
  })
}

export const domSubTreeModified = (window) => {
  const eventName = 'DOMSubtreeModified'
  window.addEventListener(eventName, debounce((event) => {
    setEvent(eventName, event)
  }, constants.DOM_SUB_TREE_MODIFIED_INTERVAL))
}

export const domActive = (window) => {
  const eventName = 'DOMActivate'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
