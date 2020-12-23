import { setEvent } from '../session'
import { getSession } from '../../storage'
import { collectEvent, shouldCollectSystemEvents } from '../../utils'
import { constants, isSysEvtStore } from '../../config'

export const blur = (window) => {
  const eventName = 'blur'
  window.addEventListener(eventName, function (event) {
    if (isSysEvtStore) {
      if (getSession(constants.SESSION_ID)) {
        setEvent(eventName, event, {})
      }
      return
    }

    if (shouldCollectSystemEvents()) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  })
}

export const focus = (window) => {
  const eventName = 'focus'
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
