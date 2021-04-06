import { sendSystemEvent } from '../index'
import { checkRetry } from '../../network/retries'
import { shouldCollectSystemEvents } from '../utils'

let isOnline = true

export const offline = (window: Window): void => {
  const eventName = 'offline'
  window.addEventListener(eventName, function (event) {
    isOnline = false
    if (shouldCollectSystemEvents()) {
      sendSystemEvent(eventName, event)
    }
  })
}

export const online = (window: Window): void => {
  const eventName = 'online'
  window.addEventListener(eventName, function (event) {
    isOnline = true
    checkRetry()
    if (shouldCollectSystemEvents()) {
      sendSystemEvent(eventName, event)
    }
  })
}

export const getIsOnline = (): boolean => isOnline
