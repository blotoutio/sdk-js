import { getVariable } from './manifest'

let endpointUrl = ''

export const setUrl = (url) => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getUrl = () => endpointUrl

export const getManifestUrl = () => {
  const apiEndPoint = getVariable('apiEndpoint') || getUrl()
  if (!apiEndPoint) {
    return ''
  }

  const urlPath = getVariable('eventPath')
  return `${apiEndPoint}/${urlPath}`
}
