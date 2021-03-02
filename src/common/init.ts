import { optionalEvents, requiredEvents } from '../event/system'
import { setUrl } from '../network/endPoint'
import { checkManifest } from './manifest'
import { setStartEvent } from '../event'
import { setUID } from './uidUtil'
import { setCustomDomain } from './domainUtil'
import { setRootKey } from '../storage/key'
import { checkSession, removeLocal } from '../storage'
import { checkRetry } from '../network/retries'
import { setClientToken } from './clientToken'

const setConfiguration = (preferences: InitPreferences) => {
  setUrl(preferences.endpointUrl)
  setClientToken(preferences.token)
  setCustomDomain(preferences.customDomain)
  setRootKey(preferences.storageRootKey)
}

export const init = (preferences?: InitPreferences): void => {
  if (!preferences) {
    return
  }

  if (!preferences.token || preferences.token.length !== 15) {
    console.info('SDK token is not valid')
    return
  }

  setConfiguration(preferences)
  const newSession = checkSession()
  setUID()
  setStartEvent()
  requiredEvents(window)
  checkManifest(newSession).then(() => {
    optionalEvents(window)
    checkRetry()
  })

  // For versions lower of 0.5, to clean old data
  removeLocal(`sdkRoot`)
  removeLocal(`sdkRootIndex`)
  removeLocal(`sdkRootUser`)
}
