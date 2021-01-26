import { getSession, setSession } from '../storage'
import { constants } from '../config'
import { getManifestVariable } from '../manifest'
import { createEventInfoObj } from '../event/session'
import { eventSync } from '../event/utils'
import { syncEvents } from '../event'
import { getDomain } from '../common/domainUtil'
const parser = require('ua-parser-js')

const getPLF = (deviceType, OS) => {
  if (deviceType === 'tablet' && OS === 'iOS') {
    return 15
  }

  if (deviceType === 'mobile' && OS === 'iOS') {
    return 14
  }

  if (deviceType === 'tablet' && OS === 'Android') {
    return 12
  }

  if (deviceType === 'mobile' && OS === 'Android') {
    return 11
  }
  if (OS === 'Mac OS') {
    return 27
  }
  if (OS === 'Windows') {
    return 26
  }
  if (OS === 'Linux') {
    return 28
  }
  if (deviceType === 'tablet' || deviceType === 'mobile') {
    return constants.MOBILE_PLATFORM_CODE
  }

  return constants.WEB_PLATFORM_CODE
}

const createMetaObject = () => {
  const parsedUA = parser(navigator.userAgent)
  const browser = navigator.brave ? 'Brave' : parsedUA.browser.name || 'unknown'

  return {
    plf: getPLF(parsedUA.device.type, parsedUA.os.name),
    domain: getDomain(),
    osv: parsedUA.os.version || '0',
    hostOS: parsedUA.os.name || '',
    browser,
    version: parsedUA.browser.version || '0.0.0.0',
    dplatform: parsedUA.device.type || 'unknown',
    ua: navigator.userAgent,
    sdkVersion: process.env.PACKAGE_VERSION,
    timeZoneOffset: new Date().getTimezoneOffset(),
  }
}

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
  for (const id in sessions) {
    if (!sessions[id] || !sessions[id].eventsData) {
      continue
    }
    if (!sessions[id].eventsData.sentToServer) {
      return id
    }
  }

  return null
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

export const createSessionObject = () => {
  return {
    startTime: Date.now(),
    endTime: 0,
    lastServerSyncTime: 0,
    geo: {},
    meta: createMetaObject(),
    viewPort: [createViewPortObject()],
    eventsData: {
      eventsInfo: [],
      navigationPath: [window.location.href],
      stayTimeBeforeNav: [],
      devCodifiedEventsInfo: [],
      sentToServer: false,
    },
  }
}

export const createViewPortObject = () => {
  return {
    timeStamp: Date.now(),
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    docHeight: document.documentElement.scrollHeight,
    docWidth: document.documentElement.scrollWidth,
  }
}
