import { setEvent } from '../common/sessionUtil'
import { getSessionData } from '../storage'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'
import { collectEvent } from '../utils'

export const keyPressed = (window) => {
  const eventName = 'keypress'
  window.addEventListener(eventName, function (e) {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, e)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, e, constants.SYSTEM_EVENT)
    }
  })
}

export const keyDown = (window) => {
  const eventName = 'help'
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 112 /* KeyboardEvent.DOM_VK_F1 */) {
      if (isSysEvtStore) {
        if (getSessionData(constants.SESSION_ID)) {
          setEvent(eventName, e)
        }
        return
      }

      if (isSysEvtCollect) {
        collectEvent(eventName, e, constants.SYSTEM_EVENT)
      }
    }
  })
}
