import { setEvent } from '../index'

export const cut = (window: Window): void => {
  const eventName = 'cut'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const copy = (window: Window): void => {
  const eventName = 'copy'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const paste = (window: Window): void => {
  const eventName = 'paste'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}