import { requiredEvents, optionalEvents } from '../event/system'
import { setUrl } from './endPointUrlUtil'
import * as log from './logUtil'
import { pullManifest } from './manifest'
import { setStartEvent } from '../event'
import { setClientToken, setUID } from './uidUtil'
import { setCustomDomain } from './domainUtil'
import { setRootKey } from '../storage/key'
import { checkSession, removeLocal } from '../storage'

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

export const init = (preferences) => {
  // we shouldn't do anything if DNT is set
  if (!preferences) {
    return
  }

  setConfiguration(preferences)
  checkSession()
  setUID()
  setStartEvent()
  requiredEvents(window)

  pullManifest()
    .then(() => {
      optionalEvents(window)
    })
    .catch(log.error)

  // For versions lower of 0.5, to clean old data
  removeLocal(`sdkRoot`)
  removeLocal(`sdkRootIndex`)
  removeLocal(`sdkRootUser`)
}
