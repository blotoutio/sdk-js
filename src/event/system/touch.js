import { setEvent } from '../session'
import { getSession } from '../../storage'
import { constants, isSysEvtStore } from '../../config'
import { shouldCollectSystemEvents } from '../utils'
import { collectEvent } from '../.'

export const touchEnd = (window) => {
  const eventName = 'touchend'
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
