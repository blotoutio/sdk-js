import { constants } from '../common/config'

let rootKey: string = null

const defaultKey = () => {
  return `_${constants.DEFAULT_STORAGE_KEY}`
}

const getKey = (name: string) => {
  let key = defaultKey()
  if (rootKey) {
    key = rootKey
  }
  return `${key}${name}`
}

export const setRootKey = (key: string): void => {
  if (!key) {
    rootKey = null
  }
  rootKey = key
}

export const getUserIndexKey = (): string => {
  return getKey('Index')
}

export const getUIDKey = (): string => {
  return getKey('User')
}

export const getCreatedKey = (): string => {
  return getKey('Created')
}

export const getRetryKey = (): string => {
  return getKey('Retry')
}

export const getSessionIDKey = (): string => {
  return getKey('Id')
}

export const getSessionDataKey = (): string => {
  return getKey('Data')
}
