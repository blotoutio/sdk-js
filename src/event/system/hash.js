import { setEvent } from '../session'
import { getSession } from '../../storage'
import { constants, isSysEvtStore } from '../../config'
import { collectEvent, shouldCollectSystemEvents } from '../../utils'

export const hashChange = (window) => {
  const eventName = 'hashchange'
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
