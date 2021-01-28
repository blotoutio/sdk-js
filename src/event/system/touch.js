import { setEvent } from '../'

export const touchEnd = (window) => {
  const eventName = 'touchend'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
