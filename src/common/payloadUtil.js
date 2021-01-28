import { constants } from './config'
import { getVariable } from './manifest'
import { getDomain } from './domainUtil'
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

const getMetaPayload = () => {
  // TODO this should be simplified in one function
  const meta = createMetaObject()

  let deviceGrain = getVariable(constants.EVENT_DEVICEINFO_GRAIN)
  if (deviceGrain == null) {
    deviceGrain = constants.DEFAULT_EVENT_DEVICEINFO_GRAIN
  }
  let dmftStr = 'unknown'
  if (meta.hostOS === 'Mac OS') {
    dmftStr = 'Apple'
  } else if (meta.hostOS === 'Windows') {
    dmftStr = 'Microsoft'
  } else if (meta.hostOS === 'Linux') {
    dmftStr = 'Ubuntu'
  } else if (meta.hostOS === 'UNIX') {
    dmftStr = 'UNIX'
  }
  const isIntelBased =
    meta.ua.includes('Intel') || meta.ua.indexOf('Intel') !== -1
  let deviceModel = 'Intel Based'
  const dplatform = meta.dplatform
  if (dplatform === 'mobile' || dplatform === 'tablet') {
    if (!isIntelBased) {
      deviceModel = 'ARM Based'
    }
  } else if (dplatform === 'desktop') {
    if (!isIntelBased) {
      deviceModel = 'AMD Based'
    }
  }
  const obj = {}
  if (deviceGrain >= 1) {
    obj.plf = meta.plf
    obj.appn = meta.domain
    obj.osv = meta.osv
    obj.appv = meta.version
    obj.dmft = dmftStr
    obj.dm = deviceModel // Should be laptop model but for now this is ok.
    obj.bnme = meta.browser
    obj.dplatform = dplatform
    obj.sdkv = meta.sdkVersion
    obj.tz_offset = meta.timeZoneOffset
  }

  if (deviceGrain >= 2) {
    obj.osn = meta.hostOS
  }

  return obj
}

export const getPayload = (events) => {
  const payload = {}
  const meta = getMetaPayload()
  if (meta && Object.keys(meta).length !== 0) {
    payload.meta = meta
  }

  if (events && events.length > 0) {
    payload.events = events
  }

  return payload
}
