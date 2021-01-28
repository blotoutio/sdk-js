import { requiredEvents, optionalEvents } from '../event/system'
import { setUrl } from './endPointUrlUtil'
import * as log from './logUtil'
import { pullManifest } from './manifest'
import { setReferrer } from './referrerUtil'
import { setStartEvent } from '../event'
import { setClientToken, setUID } from './uidUtil'
import { setCustomDomain } from './domainUtil'
import { setRootKey } from '../storage/key'
import { checkAndGetSessionId } from '../storage'

import { DNT } from './utils'

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
  if (!preferences || DNT()) {
    return
  }

  setConfiguration(preferences)
  checkAndGetSessionId()
  setUID()
  setReferrer()
  setStartEvent()
  requiredEvents(window)

  pullManifest()
    .then(() => {
      optionalEvents(window)
    })
    .catch(log.error)
}
