import SHA256 from 'crypto-js/sha256'
import SHA1 from 'crypto-js/sha1'
import { getLocal, setLocal } from '../storage'
import { convertTo64CharUUID, getUUID } from './uidUtil'
import { getUserIndexKey } from '../storage/key'

const SHA1Encode = function (data: string) {
  if (!data) {
    return ''
  }

  return SHA1(data).toString()
}

export const setUserIndex = (userID: string, isFirstIndex: boolean): void => {
  let userIndex = getLocal(getUserIndexKey())
  if (userIndex) {
    if (userIndex.length >= 1056) {
      userID = convertTo64CharUUID(SHA256Encode(userID))
      userIndex = userID
      isFirstIndex = true
    }
  } else {
    userID = convertTo64CharUUID(SHA256Encode(userID))
    userIndex = userID
  }

  let prePostUUID = getUUID()
  if (!isFirstIndex) {
    prePostUUID = SHA256Encode(prePostUUID)
    prePostUUID = convertTo64CharUUID(prePostUUID)
  }

  const idLengthHalf = prePostUUID.length / 2
  const preUUID = prePostUUID.substr(0, idLengthHalf)
  const postUUID = prePostUUID.substr(idLengthHalf)
  const indexStoreStr = preUUID + userIndex + postUUID
  setLocal(getUserIndexKey(), indexStoreStr)
}

export const SHA256Encode = (data: string): string => {
  if (!data) {
    return ''
  }

  return SHA256(data).toString()
}

export const stringToIntSum = (eventName: string): number => {
  const eventNameL = eventName.toString().toLowerCase()
  const encoded = SHA1Encode(eventNameL)
  let sum = 0
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded.charAt(i)
    sum += char.charCodeAt(0)
  }
  return sum
}
