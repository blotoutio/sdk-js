import { sendSystemEvent } from '../index'

export const keyPressed = (window: Window): void => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (event) {
    sendSystemEvent(eventName, event)
  })
}

export const keyDown = (window: Window): void => {
  const eventName = 'help'
  window.addEventListener('keydown', function (event) {
    if (event.key !== 'F1') {
      return
    }

    sendSystemEvent(eventName, event)
  })
}
