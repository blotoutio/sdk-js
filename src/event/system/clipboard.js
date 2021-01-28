import { setEvent } from '../'

export const cut = (window) => {
  const eventName = 'cut'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const copy = (window) => {
  const eventName = 'copy'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const paste = (window) => {
  const eventName = 'paste'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
