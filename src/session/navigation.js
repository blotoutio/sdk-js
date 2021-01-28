import { getSession } from '../storage'
import { constants } from '../common/config'
import { getEventsByDate, setEventsByDate } from '../event/storage'
import { getStringDate } from '../common/timeUtil'
import { getNotSyncedDate } from '../common/utils'
import { getNotSynced } from './utils'
import { getSessionForDate, setSessionForDate } from '../event/session'

export const updateNavTime = () => {
  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }

  const eventsData = session.eventsData
  const navPaths = eventsData.navigationPath
  const currentTime = Date.now()

  if (!navPaths || navPaths.length === 0) {
    return
  }

  if (
    navPaths.length === 1 ||
    window.location.href === navPaths[navPaths.length - 1]
  ) {
    eventsData.stayTimeBeforeNav.pop()
  }

  eventsData.stayTimeBeforeNav.push(currentTime)
  setSessionForDate(date, sessionId, session)
}

export const updateNavPath = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session || !session.eventsData) {
    return
  }
  const eventsData = session.eventsData
  const navPaths = eventsData.navigationPath

  if (!navPaths || navPaths.length === 0) {
    return
  }

  const lastPath = navPaths[navPaths.length - 1]
  if (window.location.href === lastPath) {
    return
  }
  eventsData.navigationPath.push(window.location.href)
  setSessionForDate(date, sessionId, session)
}

export const resetPreviousDate = () => {
  const date = getNotSyncedDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }
  const sessionId = getNotSynced(sdkData.sessions)
  if (!sessionId) {
    return
  }

  sdkData.sessions[sessionId].eventsData.navigationPath = []
  sdkData.sessions[sessionId].eventsData.stayTimeBeforeNav = []
  setEventsByDate(date, sdkData)
}
