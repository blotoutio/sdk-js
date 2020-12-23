import { callInterval, constants } from '../config'

import * as dailyActive from './dailyActive'
import * as weeklyActive from './weeklyActive'
import * as monthlyActive from './monthlyActive'
import { getLocal, getSession } from '../storage'
import { getManifestVariable, pullManifest } from '../manifest'
import { getSDK, setSDK } from '../storage/retention'
import { getCustomUseValue, getTempUseValue, setCustomUseValue, setTempUseValue } from '../storage/sharedPreferences'
import { getDate, getPayload, shouldApproximateTimestamp } from '../utils'
import { getNearestTimestamp, millisecondsToHours } from '../common/timeUtil'
import { postRequest } from '../common/networkUtil'
import { updateRoot } from '../storage/store'
import { getEventsByDate } from '../storage/event'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { info, error } from '../common/logUtil'
import { getRetentionSDK } from './utils'
import { getModifiedDate, setModifiedDate, setData } from '../manifest/storage'

const getRetentionPayloadArr = (arr, name) => {
  const eventName = name === constants.IS_NEW_USER ? constants.DNU : name
  const result = []
  const UID = getTempUseValue(constants.UID)
  arr.forEach((val) => {
    const eventTime = shouldApproximateTimestamp()
      ? getNearestTimestamp(val.tstmp)
      : val.tstmp
    const data = {
      mid: val.mid,
      userid: UID,
      evn: eventName,
      evcs: val.evcs,
      evt: eventTime,
      nmo: val.nmo,
      evc: val.evc
    }

    if (val.avgtime) {
      data.tst = val.avgtime
    }
    result.push(data)
  })

  return result
}

const getPmeta = (obj1, obj2) => {
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1
  }

  const diffs = {}
  let key

  /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
  const arraysMatch = (arr1, arr2) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }

    // Otherwise, return true
    return true
  }

  /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
  const compare = (item1, item2, key) => {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1)
    const type2 = Object.prototype.toString.call(item2)

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null
      return
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2
      return
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2)
      if (Object.keys(objDiff).length > 1) {
        diffs[key] = objDiff
      }
      return
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2
      }
      return
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2
      }
    }
  }

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1[key]) {
      compare(obj1[key], obj2[key], key)
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2[key]) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key]
      }
    }
  }

  // Return the object of differences
  return diffs
}

const getNotSyncObj = (array) => {
  if (Array.isArray(array)) {
    return array.filter((evt) => !evt.sentToServer)
  }

  if (typeof array === 'object' && !array.sentToServer) {
    return [array]
  }
}

const setSendToServer = (retentionStore, events) => {
  events.forEach((val) => {
    if (!val) {
      return
    }
    const mid = val.mid
    const key = val.evn === constants.DNU ? constants.IS_NEW_USER : val.evn
    if (!Array.isArray(retentionStore.retentionData[key])) {
      retentionStore.retentionData[key].sentToServer = true
      return
    }
    const objIdx = retentionStore.retentionData[key].findIndex((obj) => obj.mid === mid)
    retentionStore.retentionData[key][objIdx].sentToServer = true
  })
  setSDK(retentionStore)
}

const sendRetentionReq = (url, retentionStore, payload, date) => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }

  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setSendToServer(retentionStore, payload.events)
      setCustomUseValue(constants.PREVIOUS_RETENTION_META, payload.meta)

      const tempUseData = getTempUseValue(constants.FAILED_RETENTION)
      if (date && tempUseData[date]) {
        delete tempUseData[date]
      }
      setTempUseValue(constants.FAILED_RETENTION, tempUseData)

      updateRoot()
    })
    .catch(() => {
      const date = getDate()
      let tempUseData = getTempUseValue(constants.FAILED_RETENTION)
      if (!tempUseData) {
        tempUseData = {}
      }

      if (!tempUseData[date]) {
        tempUseData[date] = payload
      }
      setTempUseValue(constants.FAILED_RETENTION, tempUseData)
      updateRoot()
    })
}

export const setDailyActiveUsage = () => {
  dailyActive.setCount('dau', constants.DAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    dailyActive.setCount('dpu', constants.DPUCode)
  }
  dailyActive.setSession()
}

export const setWeeklyActiveUsage = () => {
  weeklyActive.setCount('wau', constants.WAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    weeklyActive.setCount('wpu', constants.WPUCode)
  }
  weeklyActive.setSession()
}

export const setMonthlyActiveUsage = () => {
  monthlyActive.setCount('mau', constants.MAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    monthlyActive.setCount('mpu', constants.MPUCode)
  }
  monthlyActive.setSession()
}

export const syncData = () => {
  try {
    const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
    if (!mode || mode === constants.FIRSTPARTY_MODE) {
      return
    }

    const retentionStore = getSDK()
    let arr = []
    Object.keys(retentionStore.retentionData).forEach((key) => {
      const res = getNotSyncObj(retentionStore.retentionData[key])
      if (res && res.length > 0) {
        const payloadArr = getRetentionPayloadArr(res, key)
        arr = arr.concat(payloadArr)
      }
    })

    if (arr.length === 0) {
      return
    }

    const date = getDate()
    const sessionId = getSession(constants.SESSION_ID)
    const sdkDataForDate = getEventsByDate(date)
    const valueFromSPTempUseStore = getCustomUseValue(constants.PREVIOUS_RETENTION_META)
    const payload = getPayload(sdkDataForDate.sessions[sessionId], arr)

    if (valueFromSPTempUseStore) {
      payload.pmeta = getPmeta(payload.meta, valueFromSPTempUseStore)
    }

    const url = getManifestUrl('retention')
    const tempUseData = getTempUseValue(constants.FAILED_RETENTION)
    let isTodayDate = false
    if (tempUseData) {
      Object.keys(tempUseData).forEach((val) => {
        if (val === date) {
          isTodayDate = true
        }

        sendRetentionReq(url, retentionStore, tempUseData[val], val)
      })
    }

    if (!isTodayDate) {
      sendRetentionReq(url, retentionStore, payload, '')
    }
  } catch (error) {
    info(error)
  }
}

export const setRetentionObject = () => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }
  if (getSDK() != null) {
    return
  }
  const retentionSdkData = getRetentionSDK()
  setSDK(retentionSdkData)
  updateRoot()
}

export const checkUpdateForManifest = () => {
  const modifiedDate = getModifiedDate()
  const diffTime = millisecondsToHours(Date.now() - modifiedDate)
  let manifestRefData = getManifestVariable(constants.MANIFEST_REFRESH_INTERVAL)
  manifestRefData = manifestRefData || callInterval
  if (diffTime >= manifestRefData) {
    return true
  }

  const callTime = manifestRefData - diffTime
  setTimeout(() => {
    pullManifest()
      .then((data) => {
        setModifiedDate(Date.now())
        setData(data)
        updateRoot()
      })
      .catch(error)
  }, callTime)
  return false
}
