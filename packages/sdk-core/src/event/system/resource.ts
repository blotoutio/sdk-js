import { sendSystemEvent } from '../index'

export const error = (window: Window): void => {
  const eventName = 'error'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
