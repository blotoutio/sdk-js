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

export const mouse = (window) => {
  let timer
  let setTimeoutConst

  window.addEventListener('mouseover', function (event) {
    setTimeoutConst = setTimeout(function () {
      setEvent('hover', event)
    }, 1000)
  })

  window.addEventListener('scroll', function (event) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(function () {
      setEvent('scroll', event)
    }, 2000)
  })

  window.addEventListener('mouseout', function () {
    clearTimeout(setTimeoutConst)
  })
}
