import { constants } from '../config'
import { getMid, getDate, getDomain } from '../utils'
import { getStore as getEventsStore } from '../storage/event'
import { getSDK, setSDK } from '../storage/retention'
import { updateStore } from '../storage/store'

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

// TODO(nejc): this conversion from string to timestamp are dangerous
// as we don't have timezone, which means that if someone is traveling
// data will not be correct
export const getTimestampFromKey = (key) => {
  if (!key) {
    return null
  }

  const eventDate = key.split('-')
  if (eventDate.length !== 3) {
    return null
  }

  return new Date(
    parseInt(eventDate[2]),
    parseInt(eventDate[1]) - 1,
    parseInt(eventDate[0]))
    .valueOf()
}

export const getUserObject = (code) => {
  const object = {
    sentToServer: false,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.RETENTION_CATEGORY
  }

  if (code) {
    object.evcs = code
  }

  return object
}

export const getRetentionSDK = () => {
  const date = getDate()
  return {
    createdDate: date,
    modifiedDate: date, // TODO(nejc): do we need this? I don't see being used
    domain: getDomain(),
    retentionData: getRetentionData()
  }
}

export const getHighestTimestamp = (retentions) => {
  return Math.max.apply(
    Math,
    retentions.map((item) => item.tstmp || 0))
}

export const getLastNextDayEvent = (timestamp) => {
  const eventStore = getEventsStore()
  if (!eventStore || !timestamp) {
    return {
      eventKey: '',
      eventStamp: 0
    }
  }

  const currentDate = new Date().getDate()
  for (const key in eventStore) {
    const keyTimestamp = getTimestampFromKey(key)
    const eventDate = new Date(keyTimestamp).getDate()
    if (keyTimestamp > timestamp && currentDate !== eventDate) {
      return {
        eventKey: key,
        eventStamp: keyTimestamp
      }
    }
  }

  return {
    eventKey: '',
    eventStamp: 0
  }
}

export const getSessionTotalDuration = (sessions) => {
  if (!sessions) {
    return 0
  }

  return Object.keys(sessions).reduce((accumulator, key) => {
    if (!sessions[key]) {
      return accumulator
    }

    return accumulator + (sessions[key].endTime - sessions[key].startTime)
  }, 0)
}

export const getSessionAvgObject = (code, date, averageTime) => {
  const object = {
    sentToServer: false,
    logtstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.RETENTION_CATEGORY
  }

  if (code) {
    object.evcs = code
  }

  date = parseInt(date)
  if (!isNaN(date)) {
    object.tstmp = date
  }

  if (averageTime) {
    object.avgtime = averageTime
  }

  return object
}

export const retentionWrapper = (key, func) => {
  if (!key || !func) {
    return
  }

  const retentionSDKData = getSDK()
  if (!retentionSDKData || !retentionSDKData.retentionData) {
    return
  }

  let retentions = retentionSDKData.retentionData[key]
  if (!retentions) {
    retentions = []
  }

  retentions = func(retentions)
  if (!retentions) {
    return
  }

  setSDK(retentionSDKData)
  updateStore()
}
