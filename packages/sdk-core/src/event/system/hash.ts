import { sendSystemEvent } from '../index'

export const hashChange = (window: Window): void => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}
