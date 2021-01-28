import { getStoreByDomain } from '.'

const getStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.sharedPreference
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

export const getNormalUseValue = (key) => {
  return getValue(getNormalUse(), key)
}

export const setNormalUseValue = (key, value) => {
  setValue(getNormalUse(), key, value)
}

export const getCustomUseValue = (key) => {
  return getValue(getCustomUse(), key)
}

export const setCustomUseValue = (key, value) => {
  setValue(getCustomUse(), key, value)
}
