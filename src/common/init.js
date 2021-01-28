import { requiredEvents, optionalEvents } from '../event/system'
import { setUrl } from './endPointUrlUtil'
import * as log from './logUtil'
import {
  pullManifest,
  updateManifest,
  checkManifest,
  checkUpdateForManifest,
} from '../manifest'
import { setReferrer } from './referrerUtil'
import {
  sendStartEvent,
  syncPreviousDateEvents,
  syncPreviousEvents,
} from '../event'
import { setClientToken, setUID } from './uuidUtil'
import { setCustomDomain, createDomain, getDomain } from './domainUtil'
import { setRootKey, getRootKey } from '../storage/key'
import { getLocal } from '../storage'
import { checkEventsInterval } from '../event/storage'
import { getRoot, updateRoot } from '../storage/store'
import { checkAndGetSessionId, createSessionObject } from '../session/utils'

import { getStringDate } from './timeUtil'
import { createDaySchema } from './utils'

const setInitialConfiguration = (preferences) => {
  if (!preferences) {
    return
  }

  if (!preferences.token || preferences.token.length !== 15) {
    console.error('SDK token is not valid')
    throw Error('SDK token is not valid')
  }

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
      if (checkManifest()) {
        syncPreviousDateEvents()
      }
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
        if (checkManifest()) {
          syncPreviousEvents()
        }

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
  if (!preferences) {
    return
  }

  setUrl(preferences.endpointUrl)
  setInitialConfiguration(preferences)
  initialize(false)
  setReferrer()
  sendStartEvent()
  requiredEvents(window)

  if (!checkManifest()) {
    pullManifest()
      .then(() => {
        optionalEvents(window)
      })
      .catch(log.error)
  } else {
    if (checkUpdateForManifest()) {
      updateManifest()
    }

    optionalEvents(window)
  }
}
