import { setEvent } from '../session'

export const error = (window) => {
  const eventName = 'error'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
