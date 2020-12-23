import { getSession } from '../storage'
import { constants } from '../config'
import { getEventsByDate, setEventsByDate } from '../event/storage'
import { createReferrerEventInfo } from '../common/referrerUtil'
import { getStringDate } from '../common/timeUtil'
import { getNotSyncedDate } from '../utils'
import { getNotSynced } from './utils'

export const updateNavTime = () => {
  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }

  const eventsData = sdkData.sessions[sessionId].eventsData
  const startTime = parseInt(getSession(constants.SESSION_START_TIME))
  const timeArray = eventsData.stayTimeBeforeNav || []
  const navPaths = eventsData.navigationPath
  const currentTime = Date.now()

  if (!navPaths || navPaths.length === 0) {
    return
  }

  if (window.location.href !== navPaths[navPaths.length - 1]) {
    let diffTime
    if (timeArray.length > 0) {
      const totalLogTime = timeArray.reduce((total, num) => total + num)
      const totalTimeInMilli = totalLogTime * 1000
      const totalTime = startTime + totalTimeInMilli
      diffTime = currentTime - totalTime
    } else {
      diffTime = currentTime - startTime
    }

    const diffTimeInSecs = Math.floor(diffTime / 1000)
    eventsData.stayTimeBeforeNav.push(diffTimeInSecs)
    setEventsByDate(date, sdkData)
    return
  }

  let totalTimeInMilli = 0
  if (timeArray.length > 1) {
    totalTimeInMilli = timeArray.reduce((total, num) => total + num) * 1000
  }
  const totalTime = startTime + totalTimeInMilli
  const diffTime = currentTime - totalTime
  const diffTimeInSecs = Math.floor(diffTime / 1000)
  eventsData.stayTimeBeforeNav.pop()
  eventsData.stayTimeBeforeNav.push(diffTimeInSecs)

  setEventsByDate(date, sdkData)
}

export const updateNavPath = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }
  const eventsData = sdkData.sessions[sessionId].eventsData
  const navPaths = eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  const lastPath = navPaths[navPaths.length - 1]
  if (window.location.href === lastPath) {
    return
  }
  eventsData.navigationPath.push(window.location.href)
  setEventsByDate(date, sdkData)
}

export const setReferrerEvent = (eventName, ref, meta) => {
  if (!eventName) {
    return
  }

  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId] || !sdkData.sessions[sessionId].eventsData) {
    return
  }

  const eventsData = sdkData.sessions[sessionId].eventsData
  if (!eventsData.eventsInfo) {
    return
  }
  const refIndex = eventsData.eventsInfo
    .findIndex((obj) => obj.name === eventName)
  if (refIndex !== -1) {
    return
  }

  eventsData.eventsInfo.push(createReferrerEventInfo(eventName, ref, meta))
  setEventsByDate(date, sdkData)
}

export const resetPreviousDate = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = getEventsByDate(notSyncDate)
  const sessionId = getNotSynced(sdkDataForDate.sessions)
  sdkDataForDate.sessions[sessionId].eventsData.navigationPath = []
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav = []
}
