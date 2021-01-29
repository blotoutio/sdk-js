import { constants } from '../common/config'

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

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
  }

  return sessionId
}
