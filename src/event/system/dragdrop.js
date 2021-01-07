import { setEvent } from '../session'
import { constants, isSysEvtStore } from '../../config'
import { shouldCollectSystemEvents } from '../utils'
import { collectEvent } from '../.'

export const dragStart = (window) => {
  const eventName = 'dragstart'
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

export const dragEnd = (window) => {
  const eventName = 'dragend'
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
