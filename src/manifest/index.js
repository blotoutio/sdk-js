import { getData, setData, setCreatedDate, setModifiedDate, getModifiedDate } from './storage'
import { setRetentionObject, syncData } from '../retention'
import { getRoot, updateRoot } from '../storage/store'
import { getUrl } from '../common/endPointUrlUtil'
import { manifestConst, constants, callInterval } from '../config'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { setSyncEventsInterval } from '../event'
import { getDomain } from '../common/domainUtil'
import { millisecondsToHours } from '../common/timeUtil'

let globalRetentionInterval = null

const removeEmptyValue = (array) => {
  return array.filter((el) => el != null && el !== '')
}

export const getManifestVariable = (name) => {
  const data = getData()
  if (!data) {
    return null
  }

  // TODO(nejc): we should only run this once when we save manifest
  const variables = removeEmptyValue(data.variables)
  const intervalIndex = variables.findIndex((obj) => obj.variableName === name)
  if (intervalIndex === -1) {
    return null
  }

  return variables[intervalIndex].value
}

const setManifest = (data) => {
  setCreatedDate(Date.now())
  setModifiedDate(Date.now())
  setData(data)
  setRetentionObject()
  updateRoot()
}

const setManifestRefreshInterval = () => {
  const manifestRefData = getManifestVariable(constants.MANIFEST_REFRESH_INTERVAL)
  const manifestIntervalInMSec = manifestRefData
    ? manifestRefData * 60 * 60 * 1000
    : callInterval
  if (globalRetentionInterval) {
    clearInterval(globalRetentionInterval)
  }

  globalRetentionInterval = setInterval(async () => {
    await pullManifest().catch(error)
  }, manifestIntervalInMSec)
}

export const pullManifest = () => {
  return new Promise((resolve, reject) => {
    const url = `${getUrl()}/${manifestConst.MANIFEST_PATH}`
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain()
    })
    postRequest(url, payload)
      .then((data) => {
        setManifest(data)
        setManifestRefreshInterval()
        setSyncEventsInterval()
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const updateManifest = () => {
  pullManifest()
    .then((data) => {
      setModifiedDate(Date.now())
      setData(data)
      updateRoot()
      setManifestRefreshInterval()
      setSyncEventsInterval()
      syncData()
    })
    .catch(error)
}

export const checkManifest = () => {
  const localData = getRoot()
  if (!localData) {
    return false
  }

  const domainName = getDomain()
  return localData[domainName] && localData[domainName].manifest.createdDate != null
}

export const checkUpdateForManifest = () => {
  const modifiedDate = getModifiedDate()
  const diffTime = millisecondsToHours(Date.now() - modifiedDate)
  let manifestRefData = getManifestVariable(constants.MANIFEST_REFRESH_INTERVAL)
  manifestRefData = manifestRefData || callInterval
  if (diffTime >= manifestRefData) {
    return true
  }

  const callTime = manifestRefData - diffTime
  setTimeout(() => {
    pullManifest()
      .then((data) => {
        setModifiedDate(Date.now())
        setData(data)
        updateRoot()
      })
      .catch(error)
  }, callTime)
  return false
}
