import {
  pageView as pageViewMethod,
  sendDevEvent,
  setDefaultEventData,
} from './event'
import { init as initMethod } from './common/init'
import { getUIDFromCookie } from './common/uidUtil'
import { isEnabled as isEnabledMethod, setEnable } from './common/enabled'
import { sendEvent } from './event/utils'
import { getVariable } from './common/manifest'
import { createBasicEvent } from './event/create'
import type {
  EventData,
  EventOptions,
  EventType,
  InitPreferences,
} from './typings'
import { error, setLogging } from './common/logUtil'

export const capture = (
  eventName: string,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  sendDevEvent([{ name: eventName, data, options }], options)
}

export const init = (preferences: InitPreferences): void => {
  initMethod(preferences)
}

export const getUserId = (): string => {
  return getUIDFromCookie()
}

export const pageView = (previousUrl: string, data?: EventData): void => {
  if (!isEnabled()) {
    return
  }

  pageViewMethod(previousUrl, data)
}

export const enable = (enable: boolean): void => {
  setEnable(enable)
}

export const defaultEventData = (types: EventType[], data: EventData): void => {
  setDefaultEventData(types, data)
}

export const isEnabled = (): boolean => {
  return isEnabledMethod()
}

export const logging = (enable: boolean): void => {
  setLogging(enable)
}

export const internalUtils = {
  sendEvent,
  getVariable,
  createBasicEvent,
  error,
}
