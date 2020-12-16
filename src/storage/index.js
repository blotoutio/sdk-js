import { getDomain } from '../utils'
import { getRootStore } from './store'

export const setLocalData = (name, data) => {
  if (!name) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocalData = (name) => {
  return window.localStorage.getItem(name)
}

export const setSessionData = (name, data) => {
  if (!name) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSessionData = (name) => {
  return window.sessionStorage.getItem(name)
}

export const getDomainStore = (domainName) => {
  if (!domainName) {
    domainName = getDomain()
  }

  const store = getRootStore()
  if (!store) {
    return null
  }

  return store[domainName]
}
