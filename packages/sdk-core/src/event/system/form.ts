import { sendSystemEvent } from '../index'

export const reset = (window: Window): void => {
  const eventName = 'reset'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}

export const submit = (window: Window): void => {
  const eventName = 'submit'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
