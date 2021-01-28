import { setEvent } from '../'

export const print = (window) => {
  const eventName = 'afterprint'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
