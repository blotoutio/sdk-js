import { constants, dataEncryptionEnabled } from '../config'
import { encryptAES, decryptAES } from '../common/securityUtil'
import * as log from '../common/logUtil'
import { getManifestVariable, getRootKey, initialize } from '../utils'
import { millisecondsToDays } from '../common/timeUtil'
import { getManifestStore } from './manifest'
import { getLocalData, setLocalData } from '.'

let rootStore

// TODO(nejc): why are not updateStore and setRootStore the same?
export const setRootStore = (value) => {
  rootStore = value
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
