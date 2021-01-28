import { debounce } from '../../common/utils'
import { constants } from '../../common/config'
import { setEvent } from '../session'

export const pagehide = (window) => {
  const eventName = 'onpagehide' in self ? 'pagehide' : 'unload'
  window.addEventListener(eventName, function (e) {
    setEvent(eventName, e)
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
  const eventName = 'scroll'
  window.addEventListener(
    eventName,
    debounce((event) => {
      setEvent(eventName, event)
    }, constants.SCROLL_INTERVAL)
  )
}
