import { constants } from '../config'
import { getMonthNumber, getCurrentMonthNumber, getCurrentWeekNumber, getWeekNumber } from '../common/timeUtil'
import {
  updateStore,
  getEventsStore,
  getRetentionSDKData,
  setRetentionSDKData,
  getEventsSDKDataForDate
} from '../common/storageUtil'
import {
  getUserObject,
  getRetentionSDK,
  getHighestTimestamp,
  getTobeLogDate,
  getSessionTotalDuration,
  getSessionAvgObject
} from './utils'

export const create = () => {
  const sdkObj = getRetentionSDK()
  return {
    isSynced: false,
    retentionSDK: sdkObj
  }
}

export const setDAU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.dau
  if (retention && retention.length > 0) {
    const d = new Date()
    const date = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    retention.forEach(function (val) {
      const retentionDate = new Date(val.tstmp)
      const existDate = retentionDate.getDate()
      const existMonth = retentionDate.getMonth()
      const existYear = retentionDate.getFullYear()
      if (existDate === date && existMonth === month && existYear === year) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.DAUCode)
    retentionSDKData.retentionData.dau.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setWAU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.wau
  if (retention && retention.length > 0) {
    const weekNumber = getWeekNumber(new Date())

    retention.forEach(function (val) {
      const existWeekNumber = getWeekNumber(new Date(val.tstmp))
      if (existWeekNumber === weekNumber) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.WAUCode)
    retentionSDKData.retentionData.wau.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setMAU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.mau
  if (retention && retention.length > 0) {
    const month = new Date().getMonth()

    retention.forEach(function (val) {
      const existMonth = new Date(val.tstmp).getMonth()
      if (existMonth === month) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.MAUCode)
    retentionSDKData.retentionData.mau.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setDPU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.dpu
  if (retention && retention.length > 0) {
    const d = new Date()
    const date = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    retention.forEach(function (val) {
      const retentionDate = new Date(val.tstmp)
      const existDate = retentionDate.getDate()
      const existMonth = retentionDate.getMonth()
      const existYear = retentionDate.getFullYear()
      if (existDate === date && existMonth === month && existYear === year) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.DPUCode)
    retentionSDKData.retentionData.dpu.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setWPU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.wpu
  if (retention && retention.length > 0) {
    const weekNumber = getWeekNumber(new Date())

    retention.forEach(function (val) {
      const existWeekNumber = getWeekNumber(new Date(val.tstmp))
      if (existWeekNumber === weekNumber) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.WPUCode)
    retentionSDKData.retentionData.wpu.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setMPU = () => {
  let isExist = false
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.mpu
  if (retention.length > 0) {
    const month = new Date().getMonth()

    retention.forEach(function (val) {
      const existMonth = new Date(val.tstmp).getMonth()
      if (existMonth === month) {
        isExist = true
      }
    })
  }

  if (!isExist) {
    const obj = getUserObject(constants.MPUCode)
    retentionSDKData.retentionData.mpu.push(obj)
    setRetentionSDKData(retentionSDKData)
    updateStore()
  }
}

export const setDAST = () => {
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.dast

  const highestDailyTimestamp = getHighestTimestamp(retention)
  const { eventKey, eventStamp } = getTobeLogDate(highestDailyTimestamp)

  if (!eventKey) {
    return
  }

  const sdkDataForDate = getEventsSDKDataForDate(eventKey)
  const totalDuration = getSessionTotalDuration(sdkDataForDate.sessions)
  const sessionCount = Object.keys(sdkDataForDate.sessions).length
  const avgTime = totalDuration / sessionCount
  const obj = getSessionAvgObject(constants.DASTCode, eventStamp, avgTime)

  retentionSDKData.retentionData.dast.push(obj)
  setRetentionSDKData(retentionSDKData)
  updateStore()
}

export const setWAST = () => {
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.wast
  let sessionObject = {}

  const currentWeekNumber = getCurrentWeekNumber()
  let highestWeekNumber
  if (retention.length > 0) {
    const highestTimestamp = getHighestTimestamp(retention)
    highestWeekNumber = getWeekNumber(new Date(highestTimestamp))

    if (highestWeekNumber >= currentWeekNumber) {
      return
    }
  }

  const eventStore = getEventsStore()
  Object.keys(eventStore).forEach((key) => {
    const eventDate = key.split('-')
    if (eventDate.length < 3) {
      return
    }

    const eventDateTimeStamp = new Date(
      parseInt(eventDate[2]),
      parseInt(eventDate[1]),
      parseInt(eventDate[0])
    )

    const eventDateWeekNumber = getWeekNumber(eventDateTimeStamp)
    const highestCheck = !highestWeekNumber || eventDateWeekNumber > highestWeekNumber
    if (highestCheck && eventDateWeekNumber < currentWeekNumber) {
      sessionObject = Object.assign(sessionObject, eventStore[key].sdkData.sessions)
    }
  })

  if (sessionObject.length === 0) {
    return
  }

  const totalDuration = getSessionTotalDuration(sessionObject)
  const avgTime = totalDuration / sessionObject.length
  const obj = getSessionAvgObject(constants.WASTCode, Object.keys(sessionObject)[0], avgTime)

  retentionSDKData.retentionData.wast.push(obj)
  setRetentionSDKData(retentionSDKData)
  updateStore()
}

export const setMAST = () => {
  const retentionSDKData = getRetentionSDKData()
  const retention = retentionSDKData.retentionData.mast
  let sessionObject = {}

  const currentMonthNumber = getCurrentMonthNumber()
  const eventStore = getEventsStore()
  let highestMonthNumber
  if (retention.length > 0) {
    const highestTimestamp = getHighestTimestamp(retention)
    highestMonthNumber = getMonthNumber(highestTimestamp)
  }

  Object.keys(eventStore).forEach((key) => {
    const eventDate = key.split('-')
    if (eventDate.length < 3) {
      return
    }

    const eventDateTimeStamp = new Date(
      parseInt(eventDate[2]),
      parseInt(eventDate[1]),
      parseInt(eventDate[0])
    )
    const eventDateMonthNumber = getMonthNumber(eventDateTimeStamp)
    const highestCheck = !highestMonthNumber || eventDateMonthNumber > highestMonthNumber
    if (highestCheck && eventDateMonthNumber < currentMonthNumber) {
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

  retentionSDKData.retentionData.mast.push(obj)
  setRetentionSDKData(retentionSDKData)
  updateStore()
}
