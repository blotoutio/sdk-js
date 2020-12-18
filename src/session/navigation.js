import { getSession } from '../storage'
import { constants } from '../config'
import { createRefEventInfoObj, getDate } from '../utils'
import { getEventsByDate, setEventsByDate } from '../storage/event'
import { updateRoot } from '../storage/store'
import { info } from '../common/logUtil'

export const updateNavTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  const startTime = parseInt(getSession(constants.SESSION_START_TIME))
  const timeArray = sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav
  const currentTime = Date.now()
  const navPaths = sdkDataForDate.sessions[sessionId].eventsData.navigationPath

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
    sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.push(diffTimeInSecs)
    setEventsByDate(date, sdkDataForDate)
    updateRoot()
    return
  }

  let totalLogTime = 0
  if (timeArray.length > 1) {
    totalLogTime = timeArray.reduce((total, num) => total + num)
  }
  const totalTimeInMilli = totalLogTime * 1000
  const totalTime = startTime + totalTimeInMilli
  const diffTime = currentTime - totalTime
  const diffTimeInSecs = Math.floor(diffTime / 1000)
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.pop()
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.push(diffTimeInSecs)

  setEventsByDate(date, sdkDataForDate)
  updateRoot()
}

export const updateNavPath = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getDate()
  const sdkDataForDate = getEventsByDate(date)
  const navPaths = sdkDataForDate.sessions[sessionId].eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  const lastPath = navPaths[navPaths.length - 1]
  if (window.location.href !== lastPath) {
    sdkDataForDate.sessions[sessionId].eventsData.navigationPath.push(window.location.href)
  }
  setEventsByDate(date, sdkDataForDate)
  updateRoot()
}

export const setReferrerEvent = (eventName, ref, meta) => {
  try {
    const sessionId = getSession(constants.SESSION_ID)
    const date = getDate()
    const sdkDataForDate = getEventsByDate(date)
    const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === eventName)
    if (refIndex !== -1) {
      return
    }

    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.push(createRefEventInfoObj(eventName, ref, meta))
    setEventsByDate(date, sdkDataForDate)
    updateRoot()
  } catch (error) {
    info(error)
  }
}
