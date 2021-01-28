import { getSession, setSession } from '../storage'
import { constants } from '../common/config'
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

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
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

export const createSessionObject = () => {
  return {
    startTime: Date.now(),
    endTime: 0,
    lastServerSyncTime: 0,
    meta: createMetaObject(),
    viewPort: [createViewPortObject()],
    eventsData: {
      eventsInfo: [],
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
