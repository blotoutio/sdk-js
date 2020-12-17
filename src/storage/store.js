import { constants, dataEncryptionEnabled } from '../config'
import { encryptAES, decryptAES } from '../common/securityUtil'
import * as log from '../common/logUtil'
import { getManifestVariable, getRootKey, initialize } from '../utils'
import { millisecondsToDays } from '../common/timeUtil'
import { getModifiedDate } from './manifest'
import { getLocal, setLocal } from '.'

let rootStore
const setRoot = (value) => {
  rootStore = value
}

export const getRoot = () => {
  if (rootStore) {
    return rootStore
  }

  let sdkRootObjStr = getLocal(getRootKey())
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
      setRoot(null)
      return null
    }
  }

  try {
    setRoot(JSON.parse(sdkRootObjStr))
  } catch (e) {
    log.info(e)
  }

  return rootStore
}

export const updateRoot = (store) => {
  if (store) {
    setRoot(store)
  }

  if (!rootStore) {
    return
  }

  let licenseExp = getManifestVariable(constants.LICENSE_EXPIRE_DAY_ALIVE)

  if (!licenseExp) {
    licenseExp = constants.DEFAULT_LICENSE_EXPIRE_DAY_ALIVE
  }

  const modifiedDate = getModifiedDate()
  const diffTime = millisecondsToDays(Date.now() - modifiedDate)
  if (diffTime > licenseExp) {
    return
  }

  let data = JSON.stringify(rootStore)
  if (dataEncryptionEnabled) {
    const { encryptedString } = encryptAES(data)
    data = encryptedString
  }

  setLocal(getRootKey(), data)
}
