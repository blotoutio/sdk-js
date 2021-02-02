import { setEvent } from '../'

export const keyPressed = (window: Window): void => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (event) {
    setEvent(eventName, event)
  })
}

export const keyDown = (window: Window): void => {
  const eventName = 'help'
  window.addEventListener('keydown', function (event) {
    if (event.keyCode !== 112 /* KeyboardEvent.DOM_VK_F1 */) {
      return
    }

    setEvent(eventName, event)
  })
}
