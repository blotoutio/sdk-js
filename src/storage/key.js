import { constants } from '../common/config'

let rootKey = null

const defaultKey = () => {
  return `_${constants.DEFAULT_STORAGE_KEY}`
}

const getKey = (name) => {
  let key = defaultKey()
  if (rootKey) {
    key = rootKey
  }
  return `${key}${name}`
}

export const setRootKey = (key) => {
  if (!key) {
    rootKey = null
  }
  rootKey = key
}

export const getUserIndexKey = () => {
  return getKey('Index')
}

export const getUIDKey = () => {
  return getKey('User')
}

export const getSessionIDKey = () => {
  return getKey('Id')
}

export const getSessionDataKey = () => {
  return getKey('Data')
}
