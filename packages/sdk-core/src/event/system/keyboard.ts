import { setEvent } from '../index'

export const keyPressed = (window: Window): void => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const keyDown = (window: Window): void => {
  const eventName = 'help'
  window.addEventListener('keydown', function (event) {
    if (event.key !== 'F1') {
      return
    }

    setEvent(eventName, event)
  })
}
