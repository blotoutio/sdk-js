import { setEvent } from '../session'
import { constants, isSysEvtStore, isHighFreqEventOff } from '../../config'
import { shouldCollectSystemEvents } from '../utils'
import { collectEvent } from '../.'
import { getHoverEventData, sendEvents } from './pocUtil'

export const click = (window) => {
  const eventName = 'click'
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

export const doubleClick = (window) => {
  const eventName = 'dblclick'
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

export const contextMenu = (window) => {
  const eventName = 'contextmenu'
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

// Q: Why do we send mouse position when logging scroll event?
// Q: every time that event happens new timout is created and old one is not cleared. Intentional?
// Q: we are losing scrolls as events are overwritten. Intentional?
export const mouse = (window) => {
  let hoverEvents = []
  let timer
  let setTimeoutConst
  let mousePosX
  let mousePosY = null

  window.addEventListener('mouseover', function (event) {
    mousePosX = event.pageX
    mousePosY = event.pageY
    if (!isSysEvtStore) {
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
  })

  window.addEventListener('scroll', function (event) {
    if (timer != null) {
      clearTimeout(timer)
    }

    timer = setTimeout(function () {
      if (isSysEvtStore) {
        setEvent('scroll', event, {}, { mousePosX, mousePosY })
        return
      }

      if (shouldCollectSystemEvents()) {
        collectEvent('scroll', event, constants.SCROLL_EVENT, { mousePosX, mousePosY })
      }
    }, 2000)
  })

  window.addEventListener('mouseout', function () {
    clearTimeout(setTimeoutConst)
  })
}
