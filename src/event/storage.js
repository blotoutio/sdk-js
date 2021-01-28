import { getStoreByDomain } from '../storage'
import { error } from '../common/logUtil'
import { updateRoot } from '../storage/store'
import { getVariable } from '../common/manifest'
import { constants } from '../common/config'

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
    return null
  }
  return store[dateString]
}

export const getEventsByDate = (dateString) => {
  if (!dateString) {
    return null
  }

  const store = getStoreByDate(dateString)
  if (!store) {
    return null
  }

  return store.sdkData
}

export const setEventsByDate = (dateString, data) => {
  const store = getStoreByDate(dateString)
  if (!store) {
    return
  }
  store.sdkData = data
  updateRoot()
}

export const checkEventsInterval = () => {
  let storeEventsInterval = getVariable(constants.STORE_EVENTS_INTERVAL)
  if (storeEventsInterval == null) {
    storeEventsInterval = constants.DEFAULT_STORE_EVENTS_INTERVAL
  }
  const eventStore = getStore()
  const dateCount = Object.keys(eventStore).length
  return dateCount === parseInt(storeEventsInterval)
}
