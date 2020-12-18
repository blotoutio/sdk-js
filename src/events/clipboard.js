import { setEvent } from '../session/events'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore
} from '../config'
import { collectEvent } from '../utils'
import { getSession } from '../storage'

export const cut = (window) => {
  const eventName = 'cut'
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

export const copy = (window) => {
  const eventName = 'copy'
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

export const paste = (window) => {
  const eventName = 'paste'
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
