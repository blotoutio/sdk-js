import { v4 as uuidv4 } from 'uuid'
import { getLocal, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'
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
  let userUUID = getLocal(getUIDKey())
  if (userUUID) {
    return userUUID
  }

  userUUID = generateUUID()
  setLocal(getUIDKey(), userUUID)
  setCreateTimestamp()
  return userUUID
}

export const setUID = (): void => {
  checkUID()
}

export const getUID = (): string => {
  return checkUID()
}
