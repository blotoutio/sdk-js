import { getClientToken } from '../common/clientToken'
import { constants } from '../common/config'

let endpointUrl = ''

const generateUrl = (path: string) => {
  const endpoint = getUrl()
  if (!endpoint) {
    console.log('URL is not valid')
    return ''
  }

  const token = getClientToken() || ''
  return `${endpoint}/${path}?token=${token}`
}

export const getUrl = (): string => {
  return endpointUrl
}

export const setUrl = (url?: string): void => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getPublishUrl = (): string => {
  return generateUrl('v1/events/publish')
}

export const getManifestUrl = (): string => {
  return generateUrl(constants.MANIFEST_PATH)
}
