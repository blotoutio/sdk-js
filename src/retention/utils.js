import { constants } from '../config'
import { getMid, getDate, getDomain } from '../utils'
import { getEventsStore } from '../common/storageUtil'

const getRetentionData = () => {
  return {
    isNewUser: {
      sentToServer: false,
      tstmp: Date.now(),
      mid: getMid(),
      newUser: false,
      nmo: 1,
      evc: constants.RETENTION_CATEGORY,
      evcs: constants.DNUCode
    },
    dau: [],
    dast: [],
    dpu: [],
    wau: [],
    wast: [],
    wpu: [],
    mau: [],
    mast: [],
    mpu: []
  }
}

export const getUserObject = (code) => {
  return {
    sentToServer: false,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.RETENTION_CATEGORY,
    evcs: code
  }
}

export const getRetentionSDK = () => {
  const date = getDate()
  return {
    createdDate: date,
    modifiedDate: date,
    domain: getDomain(),
    retentionData: getRetentionData()
  }
}

export const getHighestTimestamp = (array) => {
  return Math.max.apply(
    Math,
    array.map(function (o) {
      return o.tstmp
    })
  )
}

export const getTobeLogDate = (timestamp) => {
  let eventKey = ''
  let eventStamp = 0
  const eventStore = getEventsStore()
  Object.keys(eventStore).forEach((key) => {
    const eventDate = key.split('-')
    if (eventDate.length < 3) {
      return
    }

    const eventDateTimeStamp = new Date(
      parseInt(eventDate[2]),
      parseInt(eventDate[1]),
      parseInt(eventDate[0]))
      .valueOf()

    const currentDate = new Date().getDate()
    if (eventDateTimeStamp > timestamp && currentDate !== parseInt(eventDate[0])) {
      eventKey = key
      eventStamp = eventDateTimeStamp
    }
  })
  return {
    eventKey,
    eventStamp
  }
}

export const getSessionTotalDuration = (session) => {
  let totalTime = 0
  Object.keys(session).forEach((key) => {
    const sessionDuration = session[key].endTime - session[key].startTime
    totalTime += sessionDuration
  })
  return totalTime
}

export const getSessionAvgObject = (code, date, averageTime) => {
  return {
    sentToServer: false,
    tstmp: date,
    logtstmp: Date.now(),
    mid: getMid(),
    avgtime: averageTime,
    nmo: 1,
    evc: constants.RETENTION_CATEGORY,
    evcs: code
  }
}
