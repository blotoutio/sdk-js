import { setEvent } from '../session'
import { constants, isSysEvtStore } from '../../config'
import { collectEvent, shouldCollectSystemEvents } from '../../utils'
import { getSession } from '../../storage'

export const dragStart = (window) => {
  const eventName = 'dragstart'
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

export const dragEnd = (window) => {
  const eventName = 'dragend'
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
