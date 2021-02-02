import { setEvent } from '../'

export const click = (window: Window): void => {
  const eventName = 'click'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const doubleClick = (window: Window): void => {
  const eventName = 'dblclick'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const contextMenu = (window: Window): void => {
  const eventName = 'contextmenu'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const hover = (window: Window): void => {
  let timeout: ReturnType<typeof setTimeout>
  window.addEventListener('mouseover', function (event) {
    timeout = setTimeout(function () {
      setEvent('hover', event)
    }, 1000)
  })

  window.addEventListener('mouseout', function () {
    clearTimeout(timeout)
  })
}
