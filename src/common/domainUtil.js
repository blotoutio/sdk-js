import { createSessionObject } from '../session/utils'
import { createDaySchema } from '../utils'
import { getStringDate } from './timeUtil'

const createDateObject = (event, objectName) => {
  const session = createSessionObject(event, objectName)
  const dateString = getStringDate()
  return {
    [dateString]: {
      isSynced: false,
      sdkData: createDaySchema(session)
    }
  }
}

let customDomain = null

export const createDomain = (objectName) => {
  return {
    sharedPreference: {
      tempUse: {},
      normalUse: {},
      customUse: {}
    },
    manifest: {
      createdDate: null,
      modifiedDate: null,
      manifestData: null
    },
    retention: {
      isSynced: false,
      retentionSDK: null
    },
    events: createDateObject('init', objectName)
  }
}

export const setCustomDomain = (domain) => {
  customDomain = domain
}

export const getDomain = () => {
  if (customDomain) {
    return customDomain
  }
  return window.location.hostname
}
