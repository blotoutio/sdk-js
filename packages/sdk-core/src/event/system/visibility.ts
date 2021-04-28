import { sendSystemEvent } from '../index'
import { constants } from '../../common/config'

let visible = true

export const pagehide = (): void => {
  const eventName = 'onpagehide' in window ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    // This is fallback for browsers that don't trigger visibilitychange event
    // for hidden flow https://caniuse.com/?search=visibilitychange
    if (visible) {
      sendSystemEvent(constants.VISIBILITY_HIDDEN, e, {
        method: 'beacon',
      })
      visible = false
    }
  })
}

export const visibilityChange = (): void => {
  const eventName = 'visibilitychange'
  window.addEventListener(eventName, function (e) {
    if (document.visibilityState === 'visible') {
      visible = true
      sendSystemEvent(constants.VISIBILITY_VISIBLE, e)
      return
    }

    // in some cases pagehide is triggered before visibilitychange
    // so we need to only send VISIBILITY_HIDDEN once
    // https://github.com/w3c/page-visibility/issues/39
    if (document.visibilityState === 'hidden' && visible) {
      sendSystemEvent(constants.VISIBILITY_HIDDEN, e, {
        method: 'beacon',
      })
      visible = false
    }
  })
}
