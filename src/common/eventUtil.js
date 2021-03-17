import { updateStore, setValueInSPNormalUseStore, getValueFromSPNormalUseStore } from './storageUtil'
import { MD5Encode } from './securityUtil'

const customIntValueForChar = (singleChar) => {
  let value
  switch (singleChar) {
    case '0':
      value = 0
      break
    case '1':
      value = 1
      break
    case '2':
      value = 2
      break
    case '3':
      value = 3
      break
    case '4':
      value = 4
      break
    case '5':
      value = 5
      break
    case '6':
      value = 6
      break
    case '7':
      value = 7
      break
    case '8':
      value = 8
      break
    case '9':
      value = 9
      break
    case ' ':
      value = 10
      break
    case 'a':
      value = 11
      break
    case 'b':
      value = 12
      break
    case 'c':
      value = 13
      break
    case 'd':
      value = 14
      break
    case 'e':
      value = 15
      break
    case 'f':
      value = 16
      break
    case 'g':
      value = 17
      break
    case 'h':
      value = 18
      break
    case 'i':
      value = 19
      break
    case 'j':
      value = 20
      break
    case 'k':
      value = 21
      break
    case 'l':
      value = 22
      break
    case 'm':
      value = 23
      break
    case 'n':
      value = 24
      break
    case 'o':
      value = 25
      break
    case 'p':
      value = 26
      break
    case 'q':
      value = 27
      break
    case 'r':
      value = 28
      break
    case 's':
      value = 29
      break
    case 't':
      value = 30
      break
    case 'u':
      value = 31
      break
    case 'v':
      value = 32
      break
    case 'w':
      value = 33
      break
    case 'x':
      value = 34
      break
    case 'y':
      value = 35
      break
    case 'z':
      value = 36
      break
    case 'A':
      value = 37
      break
    case 'B':
      value = 38
      break
    case 'C':
      value = 39
      break
    case 'D':
      value = 40
      break
    case 'E':
      value = 41
      break
    case 'F':
      value = 42
      break
    case 'G':
      value = 43
      break
    case 'H':
      value = 44
      break
    case 'I':
      value = 45
      break
    case 'J':
      value = 46
      break
    case 'K':
      value = 47
      break
    case 'L':
      value = 48
      break
    case 'M':
      value = 49
      break
    case 'N':
      value = 50
      break
    case 'O':
      value = 51
      break
    case 'P':
      value = 52
      break
    case 'Q':
      value = 53
      break
    case 'R':
      value = 54
      break
    case 'S':
      value = 55
      break
    case 'T':
      value = 56
      break
    case 'U':
      value = 57
      break
    case 'V':
      value = 58
      break
    case 'W':
      value = 59
      break
    case 'X':
      value = 60
      break
    case 'Y':
      value = 61
      break
    case 'Z':
      value = 62
      break
    default:
      value = singleChar.charCodeAt(0)
      break
  }
  return value
}

const isAscii = (str) => {
  if (str.length === 0) {
    return false
  }
  return /^[\x00-\xFF]*$/.test(str) // eslint-disable-line
}

const asciiSum = function (eventName) {
  if (!eventName) {
    return 0
  }

  const eventNameL = eventName.toString().toLowerCase()
  if (!isAscii(eventNameL)) {
    return 0
  }

  let sum = 0
  for (let index = 0; index < eventNameL.length; index++) {
    const elementAt = eventNameL.charAt(index)
    sum += customIntValueForChar(elementAt)
  }

  return sum
}

const md5HashIntSum = (eventName) => {
  if (!eventName) {
    return 0
  }

  const eventNameL = eventName.toString().toLowerCase()
  const eventNameMD5 = MD5Encode(eventNameL)
  let sum = 0
  for (let index = 0; index < eventNameMD5.length; index++) {
    const elementAt = eventNameMD5.charAt(index)
    sum += customIntValueForChar(elementAt)
  }
  return sum
}

// Q: what does this function do?
// Q: why are re-running loop?
export const codeForCustomCodifiedEvent = (eventName) => {
  if (!eventName) {
    return 0
  }

  const eventNameTemp = eventName.split(' ').join('')
  if (!eventNameTemp || eventNameTemp.length === 0) {
    return 0
  }

  const customEventStorageName = 'EventsSubCode'
  let customEventStore = getValueFromSPNormalUseStore(customEventStorageName)
  if (!customEventStore) {
    customEventStore = {}
  } else {
    const valueFoundIsEventCode = customEventStore[eventName]
    if (valueFoundIsEventCode) {
      return valueFoundIsEventCode
    }
  }

  let eventNameIntSum
  if (isAscii(eventName)) {
    eventNameIntSum = asciiSum(eventName)
  } else {
    eventNameIntSum = md5HashIntSum(eventName)
  }

  let eventNameIntSumModulo = eventNameIntSum % 9000
  let eventSubCode = 21100 + eventNameIntSumModulo // 21100 - Check for constant file to define and use

  const allKeys = Object.keys(customEventStore)
  for (let index = 0; index < allKeys.length; index++) {
    const valAsEventName = allKeys[index]
    if (Object.prototype.hasOwnProperty.call(customEventStore, valAsEventName)) {
      if (customEventStore[valAsEventName] === eventSubCode) {
        eventNameIntSum += 1
        eventNameIntSumModulo = eventNameIntSum % 9000
        eventSubCode = 21100 + eventNameIntSumModulo
        index = 0 // re-looping again for all check
      }
    }
  }

  customEventStore[eventName] = eventSubCode
  setValueInSPNormalUseStore(customEventStorageName, customEventStore)

  updateStore()
  return eventSubCode
}
