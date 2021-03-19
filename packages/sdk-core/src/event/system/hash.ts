import { setEvent } from '../index'

export const hashChange = (window: Window): void => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
