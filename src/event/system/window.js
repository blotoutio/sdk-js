import { debounce } from '../../common/utils'
import { constants } from '../../common/config'
import { setEvent } from '../session'
import { setViewPort } from '../../session/system'

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
