import { setEvent } from '../'

export const hashChange = (window) => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
