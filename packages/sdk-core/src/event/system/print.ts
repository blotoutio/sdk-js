import { sendSystemEvent } from '../index'

export const print = (window: Window): void => {
  const eventName = 'afterprint'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
