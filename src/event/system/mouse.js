import { setEvent } from '../session'

export const click = (window) => {
  const eventName = 'click'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const doubleClick = (window) => {
  const eventName = 'dblclick'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const contextMenu = (window) => {
  const eventName = 'contextmenu'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const hover = (window) => {
  let timeout
  window.addEventListener('mouseover', function (event) {
    timeout = setTimeout(function () {
      setEvent('hover', event)
    }, 1000)
  })

  window.addEventListener('mouseout', function () {
    clearTimeout(timeout)
  })
}
