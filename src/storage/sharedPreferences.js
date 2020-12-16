import { getStoreByDomain } from '.'

const getStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.sharedPreference
}

const getTempUse = () => {
  const store = getStore()
  if (!store) {
    return null
  }
  return store.tempUse
}

const getNormalUse = () => {
  const store = getStore()
  if (!store) {
    return null
  }
  return store.normalUse
}

const getCustomUse = () => {
  const store = getStore()
  if (!store) {
    return null
  }
  return store.customUse
}

const getValue = (store, key) => {
  if (!store) {
    return null
  }
  return store[key]
}

const setValue = (store, key, value) => {
  if (!key || !store) {
    return
  }
  store[key] = value
}

export const setTempUseValue = (key, value) => {
  setValue(getTempUse(), key, value)
}

export const getTempUseValue = (key) => {
  return getValue(getTempUse(), key)
}

export const setNormalUseValue = (key, value) => {
  setValue(getNormalUse(), key, value)
}

export const getNormalUseValue = (key) => {
  return getValue(getNormalUse(), key)
}

export const setCustomUseValue = (key, value) => {
  setValue(getCustomUse(), key, value)
}

export const getCustomUseValue = function (key) {
  return getValue(getCustomUse(), key)
}
