import { setEvent } from '../session'

export const reset = (window) => {
  const eventName = 'reset'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const submit = (window) => {
  const eventName = 'submit'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}
