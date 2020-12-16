import { getStoreByDomain } from '.'
import { error } from '../common/logUtil'

export const getStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.events
}

export const setStore = (value) => {
  const store = getStoreByDomain()
  if (!store) {
    return
  }
  store.events = value
}

const getStoreByDate = (dateString) => {
  if (!dateString) {
    error('Proper date as string needs to be passed')
    return null
  }

  const store = getStore()
  if (!store) {
    return
  }
  return store[dateString]
}

export const getEventsByDate = (dateString) => {
  const store = getStoreByDate(dateString)
  if (!store) {
    return null
  }
  return typeof store.sdkData === 'object'
    ? store.sdkData
    : JSON.parse(store.sdkData)
}

export const setEventsByDate = (dateString, data) => {
  const store = getStoreByDate(dateString)
  if (!store) {
    return
  }
  store.sdkData = data
}
