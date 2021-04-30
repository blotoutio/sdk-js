import { checkRetry } from '../../network/retries'

let isOnline = true

export const offline = (): void => {
  const eventName = 'offline'
  window.addEventListener(eventName, () => {
    isOnline = false
  })
}

export const online = (): void => {
  const eventName = 'online'
  window.addEventListener(eventName, () => {
    isOnline = true
    checkRetry()
  })
}

export const getIsOnline = (): boolean => isOnline
