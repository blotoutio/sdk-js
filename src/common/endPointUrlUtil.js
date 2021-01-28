import { getManifestVariable } from '../manifest'
import { constants, manifestConst } from './config'

let endpointUrl = ''

export const setUrl = (url) => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getUrl = () => endpointUrl

const pathMapping = {
  event: {
    manifest: constants.EVENT_PATH,
    defaultPath: manifestConst.EVENT_PATH,
  },
}

export const getManifestUrl = (type = 'event') => {
  const apiEndPoint = getManifestVariable(constants.API_ENDPOINT) || getUrl()
  if (!apiEndPoint) {
    return ''
  }

  const path = pathMapping[type]
  if (!path) {
    return ''
  }

  const urlPath = getManifestVariable(path.manifest) || path.defaultPath
  return `${apiEndPoint}/${urlPath}`
}
