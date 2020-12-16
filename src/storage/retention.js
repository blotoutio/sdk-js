import { getDomainStore } from '.'

const getRetentionStore = () => {
  const store = getDomainStore()
  if (!store) {
    return null
  }
  return store.retention
}

export const getRetentionSDKData = () => {
  const retentionStore = getRetentionStore()
  if (!retentionStore) {
    return null
  }

  return typeof retentionStore.retentionSDK === 'object'
    ? retentionStore.retentionSDK
    : JSON.parse(retentionStore.retentionSDK)
}

export const setRetentionSDKData = (retention) => {
  const store = getRetentionStore()
  if (!store) {
    return
  }
  store.retentionSDK = retention
}
