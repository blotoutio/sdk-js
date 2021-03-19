import { debounce } from '../../common/utils'
import { constants } from '../../common/config'
import { setEvent } from '../index'

export const pagehide = (window: Window): void => {
  const eventName = 'onpagehide' in window ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    setEvent(constants.PAGE_HIDE, e, {
      method: 'beacon',
    })
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
