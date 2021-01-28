import { v4 as uuidv4 } from 'uuid'
import { SHA256Encode } from './securityUtil'
import { getLocal, setLocal } from '../storage'
import { getRootUID } from '../storage/key'

let staticUserID = null
let clientToken = null

const userIDUUID = () => {
  if (staticUserID) {
    return staticUserID
  }

  const userUUID = getLocal(getRootUID())
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

  const sha64Char = SHA256Encode(finalString)
  staticUserID = convertTo64CharUUID(sha64Char)
  setLocal(getRootUID(), staticUserID)
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
  userIDUUID()
}

export const getUID = () => {
  return userIDUUID()
}

export const getUUID = () => uuidv4()

export const setClientToken = (token) => {
  clientToken = token
}

export const getClientToken = () => {
  return clientToken
}
