import { optionalEvents, requiredEvents } from '../event/system'
import { setUrl } from '../network/endPoint'
import { checkManifest, loadManifest } from './manifest'
import { sendSystemEvent } from '../event'
import { setUID } from './uidUtil'
import { setRootKey } from '../storage/key'
import { checkSession, removeLocal } from '../storage'
import { checkRetry } from '../network/retries'
import { setClientToken } from './clientToken'
import type { InitPreferences } from '../typings'
import { constants } from './config'
import { checkEnabled, setInitialised } from './enabled'

const setConfiguration = (preferences: InitPreferences) => {
  setUrl(preferences.endpointUrl)
  setClientToken(preferences.token)
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
  setInitialised()
  if (!checkEnabled()) {
    return
  }

  const newSession = checkSession()
  let manifestLoaded = false
  if (!newSession) {
    manifestLoaded = loadManifest()
  }
  setUID()
  sendSystemEvent(constants.SDK_START)
  requiredEvents(window)
  if (!manifestLoaded) {
    checkManifest().then(() => {
      optionalEvents(window)
      checkRetry()
    })
  } else {
    optionalEvents(window)
    checkRetry()
  }

  // For versions lower of 0.5, to clean old data
  removeLocal(`sdkRoot`)
  removeLocal(`sdkRootIndex`)
  removeLocal(`sdkRootUser`)
}
