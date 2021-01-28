import { v4 as uuidv4 } from 'uuid'
import { getLocal, setLocal } from '../storage'
import { SHA256Encode } from './securityUtil'
import { getTempUseValue, setTempUseValue } from '../storage/sharedPreferences'
import { constants } from './config'
import { updateRoot } from '../storage/store'
import { getRootIndex } from '../storage/key'

let staticUserID = null
let clientToken = null

const updateIndexScore = (indexValueToSet, isFirstIndex) => {
  let sdkIndexData = getLocal(getRootIndex())
  if (sdkIndexData) {
    // why 1056: 68+36+68+68+68+68+68+68+68+68+68+68+68+68+68+68 = 1056
    if (sdkIndexData.length >= 1056) {
      indexValueToSet = convertTo64CharUUID(SHA256Encode(indexValueToSet))
      sdkIndexData = indexValueToSet
      isFirstIndex = true
    }
  } else {
    indexValueToSet = convertTo64CharUUID(SHA256Encode(indexValueToSet))
    sdkIndexData = indexValueToSet
  }

  let prePostUUID = getUUID()
  if (!isFirstIndex) {
    prePostUUID = SHA256Encode(prePostUUID)
    prePostUUID = convertTo64CharUUID(prePostUUID)
  }

  const idLengthHalf = prePostUUID.length / 2
  const preUUID = prePostUUID.substr(0, idLengthHalf)
  const postUUID = prePostUUID.substr(idLengthHalf)
  const indexStoreStr = preUUID + sdkIndexData + postUUID
  setLocal(getRootIndex(), indexStoreStr)
}

const userIDUUID = () => {
  if (staticUserID) {
    return staticUserID
  }

  const userUUID = getTempUseValue(constants.UID)
  if (userUUID) {
    staticUserID = userUUID
    return staticUserID
  }

  const startTime = Date.now()
  if (!clientToken) {
    return staticUserID
  }

  const initialUUID = uuidv4()
  const randomNum10Digit1 = Math.floor(100000000 + Math.random() * 900000000)
  const randomNum10Digit2 = Math.floor(100000000 + Math.random() * 900000000)
  const finalString =
    startTime +
    clientToken +
    initialUUID +
    randomNum10Digit1 +
    randomNum10Digit2 +
    Date.now()
  // finalString - "15994815055548B7PNST7CGHSF4N0a624583-c8d9-41c5-a328-43b84408fb4a8127742871616933301599481509479"

  const sha64Char = SHA256Encode(finalString) // "38c646a0c2c42534507bd19508ebde2c326bbd5a0415a766a555dd1d9656c5ae"
  staticUserID = convertTo64CharUUID(sha64Char)
  return staticUserID
}

export const convertTo64CharUUID = (stringToConvert) => {
  const lengths = [16, 8, 8, 8, 24]
  const parts = []
  let range = 0
  for (let i = 0; i < lengths.length; i++) {
    parts.push(stringToConvert.slice(range, range + lengths[i]))
    range += lengths[i]
  }

  return parts.join('-')
}

export const setUID = () => {
  const tempUseData = getTempUseValue(constants.UID)
  if (!tempUseData) {
    const userID = userIDUUID()
    updateIndexScore(userID, true)
    setTempUseValue(constants.UID, userID)
    updateRoot()
    return
  }

  setTimeout(() => {
    updateIndexScore(tempUseData, false)
  }, 500)
}

export const getUUID = () => uuidv4()

export const setClientToken = (token) => {
  clientToken = token
}
