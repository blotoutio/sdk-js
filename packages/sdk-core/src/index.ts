import {
  mapID as mapIDMethod,
  pageView as pageViewMethod,
  setDevEvent,
} from './event'
import { init as initMethod } from './common/init'
import { getUID } from './common/uidUtil'
import { getEventPayload, sendEvent } from './event/utils'
import { getVariable } from './common/manifest'
import { createDevEvent } from './event/create'
import type { EventData, EventOptions, InitPreferences } from './typings'

export const capture = (
  event: string,
  data?: EventData,
  options?: EventOptions
): void => {
  setDevEvent([{ name: event, data, options }], options)
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
  mapIDMethod(id, provider, data, options)
}

export const pageView = (): void => {
  pageViewMethod()
}

export const internalUtils = {
  getEventPayload,
  sendEvent,
  getVariable,
  createDevEvent,
}
