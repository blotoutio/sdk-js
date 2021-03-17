import { getManifestVariable } from '../utils'
import { constants } from '../config'

let endpointUrl = ''

export const setUrl = (url) => {
  endpointUrl = url
}

export const getUrl = () => endpointUrl

export const getManifestUrl = (path, defaultPath) => {
  const apiEndPoint = getManifestVariable(constants.API_ENDPOINT) || getUrl()
  const urlPath = getManifestVariable(path) || defaultPath
  return `${apiEndPoint}/${urlPath}`
}
