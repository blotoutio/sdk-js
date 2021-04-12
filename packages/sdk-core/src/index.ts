import {
  mapID as mapIDMethod,
  pageView as pageViewMethod,
  sendDevEvent,
} from './event'
import { init as initMethod } from './common/init'
import { getUID } from './common/uidUtil'
import { isEnabled, setEnable } from './common/enabled'
import { sendEvent } from './event/utils'
import { getVariable } from './common/manifest'
import { createBasicEvent } from './event/create'
import type { EventData, EventOptions, InitPreferences } from './typings'

export const capture = (
  event: string,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  sendDevEvent([{ name: event, data, options }], options)
}

export const init = (preferences: InitPreferences): void => {
  initMethod(preferences)
}

export const getUserId = (): string => {
  return getUID()
}

export const mapID = (
  id: string,
  provider: string,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  mapIDMethod(id, provider, data, options)
}

export const pageView = (previousUrl: string): void => {
  if (!isEnabled()) {
    return
  }

  pageViewMethod(previousUrl)
}

export const enable = (enable: boolean): void => {
  setEnable(enable)
}

export const internalUtils = {
  sendEvent,
  getVariable,
  createBasicEvent,
}
