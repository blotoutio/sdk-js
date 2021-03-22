import { setEvent } from '../index'

export const touchEnd = (window: Window): void => {
  const eventName = 'touchend'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}