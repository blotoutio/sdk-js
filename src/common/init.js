import { requiredEvents, optionalEvents } from '../event/system'
import { setUrl } from './endPointUrlUtil'
import * as log from './logUtil'
import { pullManifest } from './manifest'
import { setReferrer } from './referrerUtil'
import { sendStartEvent } from '../event'
import { setClientToken, setUID } from './uuidUtil'
import { setCustomDomain, createDomain, getDomain } from './domainUtil'
import { setRootKey, getRootKey } from '../storage/key'
import { getLocal } from '../storage'
import { checkEventsInterval } from '../event/storage'
import { getRoot, updateRoot } from '../storage/store'
import { checkAndGetSessionId, createSessionObject } from '../session/utils'

import { getStringDate } from './timeUtil'
import { createDaySchema, DNT } from './utils'

const setConfiguration = (preferences) => {
  if (!preferences) {
    return
  }

  if (!preferences.token || preferences.token.length !== 15) {
    console.error('SDK token is not valid')
    throw Error('SDK token is not valid')
  }

  setUrl(preferences.endpointUrl)
  setClientToken(preferences.token)
  setCustomDomain(preferences.customDomain)
  setRootKey(preferences.storageRootKey)
}

// TODO(https://github.com/blotoutio/sdk-js/issues/271)
export const initialize = (isDecryptionError) => {
  const localData = isDecryptionError ? null : getRoot()
  const hostname = getDomain()
  const date = getStringDate()
  const sessionId = checkAndGetSessionId()

  if (getLocal(getRootKey()) && localData) {
    if (localData[hostname] && !localData[hostname].events[date]) {
      const storeCheck = checkEventsInterval()

      if (storeCheck) {
        const eventKeys = Object.keys(localData[hostname].events)
        const firstKey = eventKeys[0]
        delete localData[hostname].events[firstKey]
      }
      const session = createSessionObject()
      const sdkObj = createDaySchema(session)
      localData[hostname].events[date] = {
        isSynced: false,
        sdkData: sdkObj,
      }
    } else {
      if (localData[hostname]) {
        if (!localData[hostname].events[date].sdkData.sessions[sessionId]) {
          const session = createSessionObject()
          localData[hostname].events[date].sdkData.sessions[
            sessionId
          ] = Object.assign(session)
        }
      } else {
        localData[hostname] = createDomain()
      }
    }
    updateRoot(localData)
    setUID()
    return
  }

  const domainSchema = createDomain()
  const obj = {
    domains: [hostname],
    [hostname]: domainSchema,
  }
  updateRoot(obj)
  setUID()
}

export const init = (preferences) => {
  // we shouldn't do anything if DNT is set
  if (!preferences || DNT()) {
    return
  }

  setConfiguration(preferences)
  setReferrer()
  initialize(false)
  sendStartEvent()
  requiredEvents(window)

  pullManifest()
    .then(() => {
      optionalEvents(window)
    })
    .catch(log.error)
}
