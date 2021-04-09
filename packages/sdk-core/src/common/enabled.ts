import { getSessionDataValue, setSessionDataValue } from '../storage'

let enabled = true
let initialized = false

export const setEnable = (enable: boolean): void => {
  setSessionDataValue('enabled', enable)
  enabled = enable
}

export const isEnabled = (): boolean => {
  if (!initialized) {
    console.log('SDK is not initialized')
    return false
  }

  return enabled
}

export const checkEnabled = (): boolean => {
  const value = getSessionDataValue('enabled')
  if (value == null) {
    return enabled
  }

  enabled = !!value
  return enabled
}

export const setInitialised = (): void => {
  initialized = true
}
