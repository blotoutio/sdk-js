import { setEvent } from '../session'

export const hashChange = (window) => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
