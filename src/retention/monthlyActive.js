import { constants } from '../config'
import {
  getMonthNumber,
  getCurrentMonthNumber
} from '../common/timeUtil'
import {
  getUserObject,
  getHighestTimestamp,
  getSessionTotalDuration,
  getSessionAvgObject,
  getTimestampFromKey,
  retentionWrapper
} from './utils'
import { getStore as getEventsStore } from '../storage/event'

export const setCount = (key, code) => {
  const func = (retentions) => {
    if (retentions.length > 0) {
      const month = new Date().getMonth()
      for (const retention of retentions) {
        const existMonth = new Date(retention.tstmp).getMonth()
        if (existMonth === month) {
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
    const currentMonthNumber = getCurrentMonthNumber()
    let highestMonthNumber

    if (retentions.length > 0) {
      highestMonthNumber = getMonthNumber(getHighestTimestamp(retentions))
      if (highestMonthNumber >= currentMonthNumber) {
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

      const eventMonthNumber = getMonthNumber(getTimestampFromKey(key))
      const highestCheck = !highestMonthNumber || eventMonthNumber > highestMonthNumber
      if (highestCheck && eventMonthNumber < currentMonthNumber) {
        sessionObject = Object.assign(sessionObject, eventStore[key].sdkData.sessions)
      }
    })

    const sessionCount = Object.keys(sessionObject).length
    if (sessionCount === 0) {
      return
    }

    const totalDuration = getSessionTotalDuration(sessionObject)
    const avgTime = totalDuration / sessionCount
    const obj = getSessionAvgObject(constants.MASTCode, Object.keys(sessionObject)[0], avgTime)

    retentions.push(obj)
    return retentions
  }

  retentionWrapper('mast', func)
}
