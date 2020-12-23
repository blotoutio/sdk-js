import { constants } from '../config'

let rootKey

export const getRootKey = () => {
  let key = constants.ROOT_KEY
  if (rootKey) {
    key = rootKey
  }

  return `sdk${key}`
}

export const getRootIndexKey = () => {
  let key = constants.ROOT_KEY
  if (rootKey) {
    key = rootKey
  }

  return `sdk${key}Index`
}

export const setRootKey = (key) => {
  rootKey = key
}
