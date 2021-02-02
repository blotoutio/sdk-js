import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { getDomain } from '../common/domainUtil'
import { getLocal, getSession } from '../storage'
import { getCreatedKey, getSessionDataKey } from '../storage/key'
import { info } from '../common/logUtil'
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

const getMeta = () => {
  const ua = navigator.userAgent
  const parsedUA = parser(ua)
  const browser = navigator.brave ? 'Brave' : parsedUA.browser.name || 'unknown'
  const OS = parsedUA.os.name || ''

  const deviceGrain = getVariable('deviceInfoGrain')

  let manufacture
  switch (OS) {
    case 'Mac OS': {
      manufacture = 'Apple'
      break
    }
    case 'Windows': {
      manufacture = 'Microsoft'
      break
    }
    case 'Linux': {
      manufacture = 'Ubuntu'
      break
    }
    case 'UNIX': {
      manufacture = 'UNIX'
      break
    }
    default: {
      manufacture = 'unknown'
      break
    }
  }

  const isIntelBased = ua.includes('Intel') || ua.indexOf('Intel') !== -1
  let deviceModel = 'Intel Based'
  const platform = parsedUA.device.type || 'unknown'
  if (platform === 'mobile' || platform === 'tablet') {
    if (!isIntelBased) {
      deviceModel = 'ARM Based'
    }
  } else if (platform === 'desktop') {
    if (!isIntelBased) {
      deviceModel = 'AMD Based'
    }
  }

  let sessionData
  try {
    sessionData = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
  }

  const obj = {
    sdkv: process.env.PACKAGE_VERSION,
    tz_offset: new Date().getTimezoneOffset(),
  }

  const created = parseInt(getLocal(getCreatedKey()))
  if (!isNaN(created)) {
    obj.user_id_created = created
  }

  if (sessionData) {
    if (sessionData.referrer) {
      obj.referrer = sessionData.referrer
    }

    if (sessionData.search) {
      obj.search = sessionData.search
    }
  }

  if (deviceGrain >= 1) {
    obj.plf = getPLF(parsedUA.device.type, parsedUA.os.name)
    obj.appn = getDomain()
    obj.osv = parsedUA.os.version || '0'
    obj.appv = parsedUA.browser.version || '0.0.0.0'
    obj.dmft = manufacture
    obj.dm = deviceModel
    obj.bnme = browser
    obj.dplatform = platform
  }

  if (deviceGrain >= 2) {
    obj.osn = OS
  }

  return obj
}

export const getPayload = (events) => {
  const payload = {}
  const meta = getMeta()
  if (meta && Object.keys(meta).length !== 0) {
    payload.meta = meta
  }

  if (events) {
    payload.events = events
  }

  return payload
}
