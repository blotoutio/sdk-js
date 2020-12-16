import { getDomain } from '../utils'
import { getRootStore } from './store'

export const setLocal = (name, data) => {
  if (!name) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocal = (name) => {
  return window.localStorage.getItem(name)
}

export const setSession = (name, data) => {
  if (!name) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSession = (name) => {
  return window.sessionStorage.getItem(name)
}

export const getStoreByDomain = (domainName) => {
  if (!domainName) {
    domainName = getDomain()
  }

  const store = getRootStore()
  if (!store) {
    return null
  }

  return store[domainName]
}
