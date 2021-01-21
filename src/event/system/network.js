import { setEvent } from '../session'

export const offline = (window) => {
  const eventName = 'offline'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const online = (window) => {
  const eventName = 'online'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
