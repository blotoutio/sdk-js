import { debounce } from '../../common/utils'
import { constants } from '../../common/config'
import { getSession } from '../../storage'
import { getSessionForDate, setEvent } from '../session'
import { setViewPort } from '../../session/system'
import { updateNavPath, updateNavTime } from '../../session/navigation'
import { updateEndTime } from '../../session'
import { sendBounceEvent } from '../.'
import { getStringDate } from '../../common/timeUtil'

export const resize = (window) => {
  const eventName = 'resize'
  window.addEventListener(
    eventName,
    debounce((e) => {
      setEvent(eventName, e)
      setViewPort()
    }, 3000)
  )
}

export const pagehide = (window) => {
  const eventName = 'onpagehide' in self ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    updateNavTime()
    updateNavPath()
    setEvent(eventName, e)
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
    const bncIndex = session.eventsData.eventsInfo.findIndex(
      (obj) => obj.name === constants.BOUNCE
    )
    if (bncIndex !== -1 || clkIndex !== -1) {
      return
    }

    const startTime = session.startTime
    const diffTime = Date.now() - startTime
    const diffTimeInSecs = Math.floor(diffTime / 1000).findIndex(
      (obj) => obj.name === 'click'
    )
    if (diffTimeInSecs <= 2) {
      setEvent(constants.BOUNCE, event)
      sendBounceEvent(date)
    }
  })
}

export const domSubTreeModified = (window) => {
  const eventName = 'DOMSubtreeModified'
  window.addEventListener(
    eventName,
    debounce((event) => {
      setEvent(eventName, event)
    }, constants.DOM_SUB_TREE_MODIFIED_INTERVAL)
  )
}

export const domActive = (window) => {
  const eventName = 'DOMActivate'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const scroll = (window) => {
  let timer
  window.addEventListener('scroll', function (event) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(function () {
      setEvent('scroll', event)
    }, 2000)
  })
}
