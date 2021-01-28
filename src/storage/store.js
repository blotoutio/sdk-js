import { constants } from '../common/config'
import { encryptAES, decryptAES, shouldEncrypt } from '../common/securityUtil'
import * as log from '../common/logUtil'
import { initialize } from '../common/init'
import { getLocal, removeSession, setLocal } from '.'
import { getRootKey } from './key'

let rootStore
const setRoot = (value) => {
  rootStore = value
}

export const getRoot = () => {
  if (rootStore) {
    return rootStore
  }

  let localRoot = getLocal(getRootKey())
  if (!localRoot) {
    return null
  }

  const domainStrFound = localRoot.includes(constants.DOMAINS)
  if (!domainStrFound) {
    localRoot = decryptAES(localRoot)
    const decryptSuccess = localRoot && localRoot.includes(constants.DOMAINS)
    if (!decryptSuccess) {
      // In case data decryption error, we are resetting it but need API to log
      removeSession(getRootKey())
      initialize(true)
      setRoot(null)
      return null
    }
  }

  try {
    setRoot(JSON.parse(localRoot))
  } catch (e) {
    log.info(e)
  }

  return rootStore
}

export const updateRoot = (store) => {
  if (store !== undefined) {
    setRoot(store)
  }

  if (!rootStore) {
    return
  }

  let data = JSON.stringify(rootStore)
  if (shouldEncrypt()) {
    const { encryptedString } = encryptAES(data)
    data = encryptedString
  }

  setLocal(getRootKey(), data)
}
