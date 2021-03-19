import { setEvent } from '../index'

export const error = (window: Window): void => {
  const eventName = 'error'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
