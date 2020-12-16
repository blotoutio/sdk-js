import { getStoreByDomain } from '.'

const getSharedPreferenceStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.sharedPreference
}

const getSPTempUseStore = () => {
  const store = getSharedPreferenceStore()
  if (!store) {
    return null
  }
  return store.tempUse
}

const getSPNormalUseStore = () => {
  const store = getSharedPreferenceStore()
  if (!store) {
    return null
  }
  return store.normalUse
}

const getSPCustomUseStore = () => {
  const store = getSharedPreferenceStore()
  if (!store) {
    return null
  }
  return store.customUse
}

export const setValueInSPTempUseStore = (key, value) => {
  if (!key) {
    return
  }

  const store = getSPTempUseStore()
  if (!store) {
    return
  }
  store[key] = value
}

export const getValueFromSPTempUseStore = (key) => {
  const store = getSPTempUseStore()
  if (!store) {
    return null
  }
  return store[key]
}

export const setValueInSPNormalUseStore = (key, value) => {
  if (!key) {
    return
  }

  const store = getSPNormalUseStore()
  if (!store) {
    return
  }
  store[key] = value
}

export const getValueFromSPNormalUseStore = (key) => {
  const store = getSPNormalUseStore()
  if (!store) {
    return null
  }
  return store[key]
}

export const setValueInSPCustomUseStore = (key, value) => {
  if (!key) {
    return
  }

  const store = getSPCustomUseStore()
  if (!store) {
    return
  }
  store[key] = value
}

export const getValueFromSPCustomUseStore = function (key) {
  const store = getSPCustomUseStore()
  if (!store) {
    return null
  }
  return store[key]
}
