import { getVariable } from '../common/manifest'
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
  const url = getVariable('endPoint') as string
  if (url) {
    return url
  }
  return endpointUrl
}

export const setUrl = (url?: string): void => {
  if (url == null) {
    return
  }

  endpointUrl = url
}

export const getPublishUrl = (): string => {
  const path = getVariable('eventPath') as string
  return generateUrl(path)
}

export const getManifestUrl = (): string => {
  return generateUrl(constants.MANIFEST_PATH)
}