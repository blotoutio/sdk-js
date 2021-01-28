import { getVariable } from '../manifest'
import { constants, endpoints } from './config'

let endpointUrl = ''

export const setUrl = (url) => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getUrl = () => endpointUrl

export const getManifestUrl = () => {
  const apiEndPoint = getVariable(constants.API_ENDPOINT) || getUrl()
  if (!apiEndPoint) {
    return ''
  }

  const urlPath = getVariable(constants.EVENT_PATH) || endpoints.EVENT_PATH
  return `${apiEndPoint}/${urlPath}`
}
