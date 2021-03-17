import { setEvent } from '../index'

export const dragStart = (window: Window): void => {
  const eventName = 'dragstart'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const dragEnd = (window: Window): void => {
  const eventName = 'dragend'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
