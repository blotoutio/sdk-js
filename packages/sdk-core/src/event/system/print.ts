import { setEvent } from '../index'

export const print = (window: Window): void => {
  const eventName = 'afterprint'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
