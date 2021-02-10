import { getSessionDataKey, getSessionIDKey } from './key'
import { getReferrer, getSearchParams } from '../common/utils'
import { info } from '../common/logUtil'

export const setLocal = (name: string, data: string): void => {
  if (!name) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocal = (name: string): string => {
  if (!name) {
    return null
  }
  return window.localStorage.getItem(name)
}

export const removeLocal = (name: string): void => {
  if (!name) {
    return null
  }
  window.localStorage.removeItem(name)
}

export const setSession = (name: string, data: string): void => {
  if (!name) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSession = (name: string): string => {
  if (!name) {
    return null
  }
  return window.sessionStorage.getItem(name)
}

export const checkSession = (): boolean => {
  let sessionId = getSession(getSessionIDKey())

  if (sessionId) {
    const newReferrer = getReferrer()
    if (newReferrer) {
      const oldReferrer = getSessionDataValue('referrer')
      if (oldReferrer === newReferrer) {
        return false
      }
    } else {
      return false
    }
  }

  sessionId = Date.now().toString()
  setSession(getSessionIDKey(), sessionId)
  setSession(
    getSessionDataKey(),
    JSON.stringify({
      referrer: getReferrer(),
      search: getSearchParams(),
    })
  )
  return true
}

export const getSessionDataValue = (key: string): unknown => {
  let parsed
  try {
    parsed = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
    return null
  }

  return parsed[key]
}

export const setSessionDataValue = (key: string, value: unknown): void => {
  let parsed
  try {
    parsed = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
    return null
  }

  parsed[key] = value
  setSession(getSessionDataKey(), JSON.stringify(parsed))
}
