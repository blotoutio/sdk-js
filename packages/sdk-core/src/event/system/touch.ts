import { sendSystemEvent } from '../index'

export const touchEnd = (window: Window): void => {
  const eventName = 'touchend'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
