import { constants } from '../config'
import {
  getCurrentWeekNumber,
  getWeekNumber
} from '../common/timeUtil'
import { getEventsStore } from '../common/storageUtil'
import {
  getUserObject,
  getHighestTimestamp,
  getSessionTotalDuration,
  getSessionAvgObject,
  getTimestampFromKey,
  retentionWrapper
} from './utils'

export const setCount = (key, code) => {
  const func = (retentions) => {
    if (retentions.length > 0) {
      const weekNumber = getWeekNumber(new Date())
      for (const retention of retentions) {
        const existWeekNumber = getWeekNumber(new Date(retention.tstmp))
        if (existWeekNumber === weekNumber) {
          return
        }
      }
    }

    retentions.push(getUserObject(code))
    return retentions
  }

  retentionWrapper(key, func)
}

export const setSession = () => {
  const func = (retentions) => {
    const currentWeekNumber = getCurrentWeekNumber()
    let highestWeekNumber

    if (retentions.length > 0) {
      highestWeekNumber = getWeekNumber(new Date(getHighestTimestamp(retentions)))
      if (highestWeekNumber >= currentWeekNumber) {
        return
      }
    }

    const eventStore = getEventsStore()
    if (!eventStore) {
      return
    }

    let sessionObject = {}
    Object.keys(eventStore).forEach((key) => {
      if (!eventStore[key] || !eventStore[key].sdkData) {
        return
      }

      const eventWeekNumber = getWeekNumber(new Date(getTimestampFromKey(key)))
      const highestCheck = !highestWeekNumber || eventWeekNumber > highestWeekNumber
      if (highestCheck && eventWeekNumber < currentWeekNumber) {
        sessionObject = Object.assign(sessionObject, eventStore[key].sdkData.sessions)
      }
    })

    const sessionCount = Object.keys(sessionObject).length
    if (sessionCount === 0) {
      return
    }

    const totalDuration = getSessionTotalDuration(sessionObject)
    const avgTime = totalDuration / sessionCount
    const obj = getSessionAvgObject(constants.WASTCode, Object.keys(sessionObject)[0], avgTime)

    retentions.push(obj)
    return retentions
  }

  retentionWrapper('wast', func)
}
