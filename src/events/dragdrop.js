import { setEvent } from '../common/sessionUtil'
import { getSessionData } from '../common/storageUtil'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'
import { collectEvent } from '../utils'

export const dragStart = (window) => {
  const eventName = 'dragstart'
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

export const dragEnd = (window) => {
  const eventName = 'dragend'
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