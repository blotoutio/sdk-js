import { constants } from '../common/config'

let rootKey = null

export const getRootKey = () => {
  let key = constants.ROOT_KEY
  if (rootKey) {
    key = rootKey
  }

  return `sdk${key}`
}

export const getRootIndex = () => {
  let key = constants.ROOT_KEY
  if (rootKey) {
    key = rootKey
  }

  return `sdk${key}Index`
}

export const setRootKey = (key) => {
  if (!key) {
    rootKey = null
  }
  rootKey = key
}
