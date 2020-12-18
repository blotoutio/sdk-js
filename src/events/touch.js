import { setEvent } from '../session/events'
import { getSession } from '../storage'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'
import { collectEvent } from '../utils'

export const touchEnd = (window) => {
  const eventName = 'touchend'
  window.addEventListener(eventName, function (event) {
    if (isSysEvtStore) {
      if (getSession(constants.SESSION_ID)) {
        setEvent(eventName, event)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  })
}
