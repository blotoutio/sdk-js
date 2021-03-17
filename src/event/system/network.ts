import { setEvent } from '../'
import { checkRetry } from '../../network/retries'
import { shouldCollectSystemEvents } from '../utils'

let isOnline = true

export const offline = (window: Window): void => {
  const eventName = 'offline'
  window.addEventListener(eventName, function (event) {
    isOnline = false
    if (shouldCollectSystemEvents()) {
      setEvent(eventName, event)
    }
  })
}

export const online = (window: Window): void => {
  const eventName = 'online'
  window.addEventListener(eventName, function (event) {
    isOnline = true
    checkRetry()
    if (shouldCollectSystemEvents()) {
      setEvent(eventName, event)
    }
  })
}

export const getIsOnline = (): boolean => isOnline
