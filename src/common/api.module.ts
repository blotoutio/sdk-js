import {
  mapID as mapIDS,
  pageView as pageViewMethod,
  setDevEvent,
} from '../event'
import { init as initSdk } from './init'
import { getUID } from './uidUtil'

/* #if _FEATURES !== 'full'
// #else */
import { capturePersonal as personal } from '../personal'
// #endif

export const capture = (
  event: string,
  data?: EventData,
  options?: EventOptions
): void => {
  setDevEvent([{ name: event, data, options }], options)
}

export const init = (preferences: InitPreferences): void => {
  initSdk(preferences)
}

/* #if _FEATURES !== 'full'
// #else */
export const capturePersonal = (
  event: string,
  data?: EventData,
  isPHI?: boolean,
  options?: EventOptions
): void => {
  personal({ name: event, data, options }, isPHI, options)
}
// #endif

export const getUserId = (): string => {
  return getUID()
}

export const mapID = (
  id: string,
  provider: string,
  data?: EventData,
  options?: EventOptions
): void => {
  mapIDS(id, provider, data, options)
}

export const pageView = (): void => {
  pageViewMethod()
}
