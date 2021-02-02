import { getSessionDataKey, getSessionIDKey } from './key'
import { getReferrer, getSearchParams } from '../common/utils'
import { info } from '../common/logUtil'

export const setLocal = (name, data) => {
  if (!name) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocal = (name) => {
  if (!name) {
    return null
  }
  return window.localStorage.getItem(name)
}

export const removeLocal = (name) => {
  if (!name) {
    return null
  }
  window.localStorage.removeItem(name)
}

export const setSession = (name, data) => {
  if (!name) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSession = (name) => {
  if (!name) {
    return null
  }
  return window.sessionStorage.getItem(name)
}

export const checkSession = () => {
  let sessionId = getSession(getSessionIDKey())

  if (sessionId) {
    return false
  }

  sessionId = Date.now()
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

export const getSessionDataValue = (key) => {
  let parsed
  try {
    parsed = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
    return null
  }

  return parsed[key]
}

export const setSessionDataValue = (key, value) => {
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
