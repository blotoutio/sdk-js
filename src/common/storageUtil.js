import { constants, dataEncryptionEnabled } from '../config'
import { encryptAES, decryptAES } from './securityUtil'
import * as log from './logUtil'
import { getDomain, getManifestVariable, getRootKey, initialize } from '../utils'
import { millisecondsToDays } from './timeUtil'

let rootStore = null

const getRetentionStore = () => {
  const store = getDomainStore()
  if (!store) {
    return null
  }
  return store.retention
}

const getDomainStore = (domainName) => {
  if (!domainName) {
    domainName = getDomain()
  }

  const store = getRootStore()
  if (!store) {
    return null
  }

  return store[domainName]
}

const getSharedPreferenceStore = () => {
  const store = getDomainStore()
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

const getEventsStoreForDate = (dateString) => {
  if (!dateString) {
    log.error('Proper date as string needs to be passed')
    return null
  }

  const store = getEventsStore()
  if (!store) {
    return
  }
  return store[dateString]
}

export const setLocalData = (name, data) => {
  if (name.length === 0) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocalData = (name) => {
  return window.localStorage.getItem(name)
}

export const setSessionData = (name, data) => {
  if (name.length === 0) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSessionData = (name) => {
  return window.sessionStorage.getItem(name)
}

export const updateStore = () => {
  if (!rootStore) {
    return
  }

  let licenseExp = getManifestVariable(constants.LICENSE_EXPIRE_DAY_ALIVE)

  if (!licenseExp) {
    licenseExp = constants.DEFAULT_LICENSE_EXPIRE_DAY_ALIVE
  }

  const modifiedDate = getManifestStore().modifiedDate
  const diffTime = millisecondsToDays(Date.now() - modifiedDate)
  if (diffTime > licenseExp) {
    return
  }

  let data = JSON.stringify(rootStore)
  if (dataEncryptionEnabled) {
    const { encryptedString } = encryptAES(data)
    data = encryptedString
  }

  setLocalData(getRootKey(), data)
}

export const getRootStore = () => {
  if (rootStore) {
    return rootStore
  }

  let sdkRootObjStr = getLocalData(getRootKey())
  if (!sdkRootObjStr) {
    return null
  }

  const domainStrFound = sdkRootObjStr.includes(constants.DOMAINS)
  if (!domainStrFound) {
    sdkRootObjStr = decryptAES(sdkRootObjStr)
    const decryptSuccess = sdkRootObjStr.includes(constants.DOMAINS)
    if (!decryptSuccess) {
      // In case data decryption error, we are resetting it but need API to log
      window.localStorage.removeItem(getRootKey())
      initialize(true)
      setRootStore(null)
      return null
    }
  }

  try {
    setRootStore(JSON.parse(sdkRootObjStr))
  } catch (e) {
    log.info(e)
  }

  return rootStore
}

export const setRootStore = (value) => {
  rootStore = value
}

export const getManifestStore = () => {
  const store = getDomainStore()
  if (!store) {
    return null
  }
  return store.manifest
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

export const getManifestModifiedDate = () => {
  const store = getManifestStore()
  if (!store) {
    return null
  }
  return store.modifiedDate
}

export const setManifestCreatedDate = (value) => {
  const store = getManifestStore()
  if (!store) {
    return
  }
  store.createdDate = value
}

export const setManifestModifiedDate = (value) => {
  const store = getManifestStore()
  if (!store) {
    return
  }
  store.modifiedDate = value
}

export const setManifestDataStore = (manifest) => {
  if (!manifest) {
    return
  }

  const store = getManifestStore()
  if (!store) {
    return
  }
  store.manifestData = manifest
}

export const getRetentionSDKData = () => {
  const retentionStore = getRetentionStore()
  if (!retentionStore) {
    return null
  }

  return typeof retentionStore.retentionSDK === 'object'
    ? retentionStore.retentionSDK
    : JSON.parse(retentionStore.retentionSDK)
}

export const setRetentionSDKData = (retention) => {
  const store = getRetentionStore()
  if (!store) {
    return
  }
  store.retentionSDK = retention
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
