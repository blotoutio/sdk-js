import { v4 as uuidv4 } from 'uuid'
import { getLocal, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'
import { getClientToken } from './clientToken'
import { setCreateTimestamp } from './utils'

export const generateUUID = (): string => {
  let time = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    time += performance.now()
  }

  time = parseInt(time.toString(), 10)

  return `${uuidv4()}-${time}-${uuidv4()}`
}

const checkUID = () => {
  const userUUID = getLocal(getUIDKey())
  if (userUUID) {
    return userUUID
  }

  const clientToken = getClientToken()
  if (!clientToken) {
    return null
  }

  setLocal(getUIDKey(), generateUUID())
  setCreateTimestamp()
  return userUUID
}

export const setUID = (): void => {
  checkUID()
}

export const getUID = (): string => {
  return checkUID()
}
