import { getStoreByDomain } from '.'

const getStore = () => {
  const store = getStoreByDomain()
  if (!store) {
    return null
  }
  return store.retention
}

export const getSDK = () => {
  const retentionStore = getStore()
  if (!retentionStore) {
    return null
  }

  return retentionStore.retentionSDK
}

export const setSDK = (retention) => {
  const store = getStore()
  if (!store) {
    return
  }
  store.retentionSDK = retention
}
