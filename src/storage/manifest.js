import { getDomainStore } from '.'

export const getManifestStore = () => {
  const store = getDomainStore()
  if (!store) {
    return null
  }
  return store.manifest
}

export const getManifestModifiedDate = () => {
  const store = getManifestStore()
  if (!store) {
    return null
  }
  return store.modifiedDate
}

export const setManifestCreatedDate = (value) => {
  const store = getManifestStore()
  if (!store) {
    return
  }
  store.createdDate = value
}

export const setManifestModifiedDate = (value) => {
  const store = getManifestStore()
  if (!store) {
    return
  }
  store.modifiedDate = value
}

export const setManifestDataStore = (manifest) => {
  if (!manifest) {
    return
  }

  const store = getManifestStore()
  if (!store) {
    return
  }
  store.manifestData = manifest
}
