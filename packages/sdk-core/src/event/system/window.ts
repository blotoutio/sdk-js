import { debounce } from '../../common/utils'
import { constants } from '../../common/config'
import { setEvent } from '../index'

let visible = true

export const pagehide = (window: Window): void => {
  const eventName = 'onpagehide' in window ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    // This is fallback for browsers that don't trigger visibilitychange event
    // for hidden flow https://caniuse.com/?search=visibilitychange
    if (visible) {
      setEvent(constants.VISIBILITY_HIDDEN, e, {
        method: 'beacon',
      })
      visible = false
    }
  })
}

export const domSubTreeModified = (window: Window): void => {
  const eventName = 'DOMSubtreeModified'
  window.addEventListener(
    eventName,
    debounce((event: Event) => {
      setEvent(eventName, event)
    }, constants.DOM_SUB_TREE_MODIFIED_INTERVAL)
  )
}

export const domActive = (window: Window): void => {
  const eventName = 'DOMActivate'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const scroll = (window: Window): void => {
  const eventName = 'scroll'
  window.addEventListener(
    eventName,
    debounce((event: Event) => {
      setEvent(eventName, event)
    }, constants.SCROLL_INTERVAL)
  )
}

export const visibilityChange = (window: Window): void => {
  const eventName = 'visibilitychange'
  window.addEventListener(eventName, function (e) {
    if (document.visibilityState === 'visible') {
      visible = true
      setEvent(constants.VISIBILITY_VISIBLE, e)
      return
    }

    // in some cases pagehide is triggered before visibilitychange
    // so we need to only send VISIBILITY_HIDDEN once
    // https://github.com/w3c/page-visibility/issues/39
    if (document.visibilityState === 'hidden' && visible) {
      setEvent(constants.VISIBILITY_HIDDEN, e, {
        method: 'beacon',
      })
      visible = false
    }
  })
}
