import { sendSystemEvent } from '../index'

export const blur = (window: Window): void => {
  const eventName = 'blur'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}

export const focus = (window: Window): void => {
  const eventName = 'focus'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
