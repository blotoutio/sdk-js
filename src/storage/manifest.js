import { getStoreByDomain } from '.'

export const getStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.manifest
}

export const setData = (manifest) => {
  if (!manifest) {
    return
  }

  const store = getStore()
  if (!store) {
    return
  }
  store.manifestData = manifest
}

export const getData = () => {
  const store = getStore()
  if (!store) {
    return null
  }
  return store.manifestData
}

export const getModifiedDate = () => {
  const store = getStore()
  if (!store) {
    return null
  }
  return store.modifiedDate
}

export const setModifiedDate = (value) => {
  const store = getStore()
  if (!store) {
    return
  }
  store.modifiedDate = value
}

export const setCreatedDate = (value) => {
  const store = getStore()
  if (!store) {
    return
  }

  if (store.createdDate) {
    return
  }

  store.createdDate = value
}
