import { v4 as uuidv4 } from 'uuid'
import { SHA256Encode } from './securityUtil'
import { getLocal, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'
import { getClientToken } from './clientToken'
/// #if FEATURES == 'full'
import { setUserIndex } from '../personal/security'
/// #endif

const checkUID = () => {
  let userUUID = getLocal(getUIDKey())
  if (userUUID) {
    return userUUID
  }

  const startTime = Date.now()
  const clientToken = getClientToken()
  if (!clientToken) {
    return null
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

  const sha64Char = SHA256Encode(finalString)
  userUUID = convertTo64CharUUID(sha64Char)
  setLocal(getUIDKey(), userUUID)
  return userUUID
}

export const convertTo64CharUUID = (stringToConvert: string): string => {
  if (!stringToConvert) {
    return ''
  }

  const lengths = [16, 8, 8, 8, 24]
  const parts = []
  let range = 0
  for (let i = 0; i < lengths.length; i++) {
    parts.push(stringToConvert.slice(range, range + lengths[i]))
    range += lengths[i]
  }

  return parts.join('-')
}

export const setUID = (newUser: boolean): void => {
  const id = checkUID()
  /// #if FEATURES == 'full'
  setUserIndex(id, newUser)
  /// #endif
}

export const getUID = (): string => {
  return checkUID()
}

export const getUUID = (): string => uuidv4()
