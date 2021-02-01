import { getSessionDataKey, getSessionIDKey } from './key'
import { getReferrer, getSearchParams } from '../common/utils'

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
    return
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
}
