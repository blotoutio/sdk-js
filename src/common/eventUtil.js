import { SHA1Encode } from './securityUtil'
import { constants } from '../config'
import { updateStore } from '../storage/store'
import { getValueFromSPNormalUseStore, setValueInSPNormalUseStore } from '../storage/sharedPreferences'

const hashIntSum = (eventName) => {
  const eventNameL = eventName.toString().toLowerCase()
  const encoded = SHA1Encode(eventNameL)
  let sum = 0
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded.charAt(i)
    sum += char.charCodeAt(0)
  }
  return sum
}

const checkIfCodeExists = (eventName) => {
  const customEventStore = getValueFromSPNormalUseStore(constants.CUSTOM_EVENT_STORAGE)
  if (customEventStore) {
    const valueFoundIsEventCode = customEventStore[eventName]
    if (valueFoundIsEventCode) {
      return valueFoundIsEventCode
    }
  }

  return 0
}

const generateSubCode = (eventSum) => {
  return constants.DEVELOPER_EVENT_CUSTOM + (eventSum % 8899)
}

export const codeForCustomCodifiedEvent = (eventName) => {
  if (!eventName) {
    return 0
  }

  let eventSubCode = checkIfCodeExists(eventName)
  if (eventSubCode !== 0) {
    return eventSubCode
  }

  let eventNameIntSum = hashIntSum(eventName)
  eventSubCode = generateSubCode(eventNameIntSum)

  const customEventStore = getValueFromSPNormalUseStore(constants.CUSTOM_EVENT_STORAGE) || {}
  const keys = Object.keys(customEventStore)
  for (let i = 0; i < keys.length; i++) {
    const valAsEventName = keys[i]
    if (customEventStore[valAsEventName] === eventSubCode) {
      eventNameIntSum += 1
      eventSubCode = generateSubCode(eventNameIntSum)
      i = 0 // re-looping again to check new code
    }
  }

  customEventStore[eventName] = eventSubCode
  setValueInSPNormalUseStore(constants.CUSTOM_EVENT_STORAGE, customEventStore)

  updateStore()
  return eventSubCode
}
