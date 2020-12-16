import { setEvent } from '../common/sessionUtil'
import { getSessionData } from '../storage'
import {
  constants,
  isSysEvtCollect,
  isSysEvtStore,
  isHighFreqEventOff
} from '../config'
import { collectEvent } from '../utils'
import { getHoverEventData, getsScrollEventData, sendEvents, sendScrollEvents } from './pocUtil'

export const click = (window) => {
  const eventName = 'click'
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

export const doubleClick = (window) => {
  const eventName = 'dblclick'
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

export const contextMenu = (window) => {
  const eventName = 'contextmenu'
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

// Q: Why do we send mouse position when logging scroll event?
// Q: every time that event happens new timout is created and old one is not cleared. Intentional?
// Q: we are losing scrolls as events are overwritten. Intentional?
export const mouse = (window) => {
  let hoverEvents = []
  let timer
  let startTime
  let setTimeoutConst
  let mousePosX
  let mousePosY = null

  window.addEventListener('mouseover', function (event) {
    mousePosX = event.pageX
    mousePosY = event.pageY
    if (isSysEvtStore) {
      if (!getSessionData(constants.SESSION_ID)) {
        return
      }

      setTimeoutConst = setTimeout(function () {
        setEvent('hover', event)
      }, 1000)

      if (isHighFreqEventOff) {
        return
      }

      hoverEvents.push(
        getHoverEventData('hoverc', event, {})
      )

      setTimeout(function () {
        const eventsArr = hoverEvents
        hoverEvents = []
        if (eventsArr.length > 0) {
          sendEvents(eventsArr)
        }
      }, 30000)
    }
  })

  window.addEventListener('scroll', function (event) {
    if (isSysEvtStore) {
      if (!getSessionData(constants.SESSION_ID)) {
        return
      }

      if (timer === null) {
        startTime = Date.now()
      } else {
        clearTimeout(timer)
      }

      timer = setTimeout(function () {
        const eventsArr = []
        eventsArr.push(
          getsScrollEventData(
            'scroll',
            event,
            {},
            { mousePosX, mousePosY }
          )
        )
        sendScrollEvents(eventsArr, startTime, Date.now())
      }, 2000)
    }
  })

  window.addEventListener('mouseout', function () {
    clearTimeout(setTimeoutConst)
  })
}
