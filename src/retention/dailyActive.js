import { constants } from '../config'
import { getEventsSDKDataForDate } from '../common/storageUtil'
import {
  getUserObject,
  getHighestTimestamp,
  getLastNextDayEvent,
  getSessionTotalDuration,
  getSessionAvgObject,
  retentionWrapper
} from './utils'
import { getFormattedDate } from '../common/timeUtil'

export const setCount = (key, code) => {
  const func = (retentions) => {
    if (retentions.length > 0) {
      const currentDate = getFormattedDate(new Date())
      for (const retention of retentions) {
        const retentionDate = getFormattedDate(new Date(retention.tstmp))
        if (retentionDate === currentDate) {
          return
        }
      }
    }

    retentions.push(getUserObject(code))
    return retentions
  }

  retentionWrapper(key, func)
}

// TODO(nejc): DAST is reported with a delay as we only log next time for a
//  previous day
export const setSession = () => {
  const func = (retentions) => {
    const highestDailyTimestamp = getHighestTimestamp(retentions)
    const { eventKey, eventStamp } = getLastNextDayEvent(highestDailyTimestamp)
    if (!eventKey) {
      return
    }

    const sdkDataForDate = getEventsSDKDataForDate(eventKey)
    if (!sdkDataForDate) {
      return
    }
    const sessionCount = Object.keys(sdkDataForDate.sessions).length
    if (sessionCount === 0) {
      return
    }

    const totalDuration = getSessionTotalDuration(sdkDataForDate.sessions)
    const avgTime = totalDuration / sessionCount
    const obj = getSessionAvgObject(constants.DASTCode, eventStamp, avgTime)

    retentions.push(obj)
    return retentions
  }

  retentionWrapper('dast', func)
}
