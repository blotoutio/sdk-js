import { setEvent } from '../'

export const blur = (window) => {
  const eventName = 'blur'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const focus = (window) => {
  const eventName = 'focus'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
