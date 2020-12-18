import { setEvent } from '../session/event'
import { getSession } from '../storage'
import {
  constants,
  isSysEvtStore
} from '../config'
import { collectEvent, shouldCollectSystemEvents } from '../utils'

export const error = (window) => {
  const eventName = 'error'
  window.addEventListener(eventName, function (event) {
    if (isSysEvtStore) {
      if (getSession(constants.SESSION_ID)) {
        setEvent(eventName, event)
      }
      return
    }

    if (shouldCollectSystemEvents()) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  })
}
