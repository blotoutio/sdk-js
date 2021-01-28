import { createSessionObject } from '../session/utils'
import { createDaySchema } from './utils'
import { getStringDate } from './timeUtil'

const createDateObject = () => {
  const session = createSessionObject()
  const dateString = getStringDate()
  return {
    [dateString]: {
      isSynced: false,
      sdkData: createDaySchema(session),
    },
  }
}

let customDomain = null

export const createDomain = () => {
  return {
    sharedPreference: {
      tempUse: {},
      normalUse: {},
      customUse: {},
    },
    manifest: {
      createdDate: null,
      modifiedDate: null,
      manifestData: null,
    },
    events: createDateObject(),
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
