import { setEvent } from '../session'
import { shouldCollectSystemEvents } from '../utils'
import { collectEvent } from '../.'
import { constants, isSysEvtStore } from '../../config'

export const blur = (window) => {
  const eventName = 'blur'
  window.addEventListener(eventName, function (event) {
    if (isSysEvtStore) {
      setEvent(eventName, event, {})
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
      setEvent(eventName, event)
      return
    }

    if (shouldCollectSystemEvents()) {
      collectEvent(eventName, event, constants.SYSTEM_EVENT)
    }
  })
}
