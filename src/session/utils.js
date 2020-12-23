import { getSession, setSession } from '../storage'
import { constants } from '../config'
import { syncEvents } from '../utils'
import { getManifestVariable } from '../manifest'

const getNotSyncedEventsCount = (obj) => {
  if (!obj || !obj.eventsInfo || !obj.devCodifiedEventsInfo) {
    return 0
  }
  let events = obj.eventsInfo.filter((evt) => !evt.sentToServer)
  const devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  events = events.concat(devEvents)
  return events.length
}

const checkEventPushEventCounter = (eventsData) => {
  const eventsCount = getNotSyncedEventsCount(eventsData)
  let manifestCounter = getManifestVariable(constants.EVENT_PUSH_EVENTSCOUNTER)
  if (manifestCounter == null) {
    manifestCounter = constants.DEFAULT_EVENT_PUSH_EVENTSCOUNTER
  }

  return eventsCount >= parseInt(manifestCounter)
}

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

export const getNotSynced = (sessions) => {
  let sessionId = null
  for (const id in sessions) {
    if (!sessions[id].eventsData) {
      continue
    }
    sessionId = id
    if (!sessions[id].eventsData.sentToServer) {
      break
    }
  }
  return sessionId
}

export const maybeSync = (eventsData) => {
  if (!eventsData) {
    return
  }
  const isEventPush = checkEventPushEventCounter(eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }
}
