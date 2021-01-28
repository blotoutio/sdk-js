import { getUrl } from '../common/endPointUrlUtil'
import { endpoints } from '../common/config'
import { postRequest } from '../common/networkUtil'
import { getDomain } from '../common/domainUtil'

const removeEmptyValue = (array) => {
  return array.filter((el) => el != null && el !== '')
}

let manifest = null

const setData = (data) => {
  if (!data || !data.variables) {
    return
  }

  manifest = removeEmptyValue(data.variables)
}

export const getVariable = (name) => {
  if (!manifest) {
    return null
  }

  const intervalIndex = manifest.findIndex((obj) => obj.variableName === name)
  if (intervalIndex === -1) {
    return null
  }

  return manifest[intervalIndex].value
}

export const pullManifest = () => {
  return new Promise((resolve, reject) => {
    const url = `${getUrl()}/${endpoints.MANIFEST_PATH}`
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain(),
    })
    postRequest(url, payload)
      .then((data) => {
        setData(data)
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}
