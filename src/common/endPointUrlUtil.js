import { getVariable } from './manifest'
import { getClientToken } from './uidUtil'
import { constants } from './config'

let endpointUrl = ''

const generateUrl = (path) => {
  const endpoint = getVariable('apiEndpoint') || getUrl()
  if (!endpoint) {
    return ''
  }

  const token = getClientToken() || ''
  return `${endpoint}/${path}?token=${token}`
}

export const getUrl = () => endpointUrl

export const setUrl = (url) => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getPublishUrl = () => {
  const path = getVariable('eventPath')
  return generateUrl(path)
}

export const getManifestUrl = () => {
  return generateUrl(constants.MANIFEST_PATH)
}
