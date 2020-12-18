import { getSession, setSession } from '../storage'
import { constants } from '../config'

export const eventSync = {
  inProgress: false,
  set progressStatus (status) {
    this.inProgress = status
  },
  get progressStatus () {
    return this.inProgress
  }
}

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
    // To calculate navigation time
    setSession(constants.SESSION_START_TIME, sessionId)
  }

  return sessionId
}

export const getNotSyncedSession = (object) => {
  let lastSyncSession
  for (const x in object) {
    lastSyncSession = x
    if (!object[x].eventsData.sentToServer) {
      break
    }
  }
  return lastSyncSession
}
