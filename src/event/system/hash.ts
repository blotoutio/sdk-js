import { setEvent } from '../'

export const hashChange = (window: Window): void => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
