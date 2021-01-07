import { setEvent } from '../session'
import { constants, isSysEvtStore } from '../../config'
import { shouldCollectSystemEvents } from '../utils'
import { collectEvent } from '../.'

export const keyPressed = (window) => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      setEvent(eventName, e)
      return
    }

    if (shouldCollectSystemEvents()) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}

export const keyDown = (window) => {
  const eventName = 'help'
  window.addEventListener('keydown', function (e) {
    if (e.keyCode !== 112 /* KeyboardEvent.DOM_VK_F1 */) {
      return
    }

    if (isSysEvtStore) {
      setEvent(eventName, e)
      return
    }

    if (shouldCollectSystemEvents()) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}
