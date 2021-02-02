import { setEvent } from '../'

export const error = (window: Window): void => {
  const eventName = 'error'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
