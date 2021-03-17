import { setEvent } from '../common/sessionUtil'
import { getSessionData } from '../common/storageUtil'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'
import { collectEvent } from '../utils'

export const hashChange = (window) => {
  const eventName = 'hashchange'
  window.addEventListener(eventName, function (event) {
    if (isSysEvtStore) {
      if (getSessionData(constants.SESSION_ID)) {
        setEvent(eventName, event)
      }
      return
    }

    if (isSysEvtCollect) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  })
}
