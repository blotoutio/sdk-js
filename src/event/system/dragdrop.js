import { setEvent } from '../session'

export const dragStart = (window) => {
  const eventName = 'dragstart'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const dragEnd = (window) => {
  const eventName = 'dragend'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
