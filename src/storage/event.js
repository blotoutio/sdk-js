import { getDomainStore } from '.'
import { error } from '../common/logUtil'

const getEventsStoreForDate = (dateString) => {
  if (!dateString) {
    error('Proper date as string needs to be passed')
    return null
  }

  const store = getEventsStore()
  if (!store) {
    return
  }
  return store[dateString]
}

export const getEventsSDKDataForDate = (dateString) => {
  const store = getEventsStoreForDate(dateString)
  if (!store) {
    return null
  }
  return typeof store.sdkData === 'object'
    ? store.sdkData
    : JSON.parse(store.sdkData)
}

export const setEventsSDKDataForDate = (dateString, data) => {
  const store = getEventsStoreForDate(dateString)
  if (!store) {
    return
  }
  store.sdkData = data
}
export const getEventsStore = () => {
  const store = getDomainStore()
  if (!store) {
    return null
  }
  return store.events
}

export const setEventsStore = (value) => {
  const store = getDomainStore()
  if (!store) {
    return
  }
  store.events = value
}
