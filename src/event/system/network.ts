import { setEvent } from '../'

export const offline = (window: Window): void => {
  const eventName = 'offline'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const online = (window: Window): void => {
  const eventName = 'online'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
