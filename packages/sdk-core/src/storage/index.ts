import { getSessionDataKey, getSessionIDKey } from './key'
import { getReferrer, getSearchParams } from '../common/utils'
import { info } from '../common/logUtil'

const creteSession = () => {
  const sessionId = Date.now().toString()
  setSession(getSessionIDKey(), sessionId)

  const sessionData: Partial<SessionData> = {
    referrer: getReferrer(),
    search: getSearchParams(),
  }
  setSession(getSessionDataKey(), JSON.stringify(sessionData))
  return sessionId
}

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
    return
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
  const sessionId = getSession(getSessionIDKey())

  if (sessionId) {
    return false
  }

  creteSession()
  return true
}

export const getSessionDataValue = (key: keyof SessionData): unknown => {
  let parsed
  try {
    parsed = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
    return null
  }

  if (!parsed) {
    return null
  }

  return parsed[key]
}

export const setSessionDataValue = (
  key: keyof SessionData,
  value: unknown
): void => {
  let parsed
  try {
    parsed = JSON.parse(getSession(getSessionDataKey())) || {}
  } catch (e) {
    info(e)
    return
  }

  parsed[key] = value
  setSession(getSessionDataKey(), JSON.stringify(parsed))
}

export const getSessionID = (): string => {
  let sessionId = getSession(getSessionIDKey())

  if (!sessionId) {
    sessionId = creteSession()
  }

  return sessionId
}
