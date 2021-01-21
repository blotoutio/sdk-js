import { setEvent } from '../session'
export const print = (window) => {
  const eventName = 'afterprint'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
