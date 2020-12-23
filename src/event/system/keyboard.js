import { setEvent } from '../session'
import { getSession } from '../../storage'
import { constants, isSysEvtStore } from '../../config'
import { collectEvent, shouldCollectSystemEvents } from '../../utils'

export const keyPressed = (window) => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      if (getSession(constants.SESSION_ID)) {
        setEvent(eventName, e)
      }
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
    if (e.keyCode === 112 /* KeyboardEvent.DOM_VK_F1 */) {
      if (isSysEvtStore) {
        if (getSession(constants.SESSION_ID)) {
          setEvent(eventName, e)
        }
        return
      }

      if (shouldCollectSystemEvents()) {
        collectEvent(eventName, e, constants.SYSTEM_EVENT)
      }
    }
  })
}
