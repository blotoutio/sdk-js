import { constants } from '../common/config'
import { getVariable } from '../common/manifest'
import { getDomain } from '../common/domainUtil'
import { getLocal, getSession } from '../storage'
import { getCreatedKey, getSessionDataKey } from '../storage/key'
import { info } from '../common/logUtil'
import { UAParser } from 'ua-parser-js'

const getPlatform = (deviceType: string, OS: string) => {
  if (OS === 'iOS') {
    if (deviceType === 'tablet') {
      return 15
    }

    if (deviceType === 'mobile') {
      return 14
    }
  }

  if (OS === 'Android') {
    if (deviceType === 'tablet') {
      return 12
    }

    if (deviceType === 'mobile') {
      return 11
    }
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

const getDevice = (type: string, OS: string) => {
  const ua = navigator.userAgent
  const isIntelBased = ua.includes('Intel') || ua.indexOf('Intel') !== -1
  let model = 'Intel Based'
  type = type || 'unknown'
  if (type === 'unknown') {
    if (OS === 'Mac OS' || OS === 'Windows' || OS === 'Linux') {
      type = 'desktop'
    }
  }

  if (type === 'mobile' || type === 'tablet') {
    if (!isIntelBased) {
      model = 'ARM Based'
    }
  } else if (type === 'desktop') {
    if (!isIntelBased) {
      model = 'AMD Based'
    }
  }

  return {
    model,
    type,
  }
}

const getMeta = () => {
  const ua = navigator.userAgent
  const parsedUA = new UAParser(ua)
  const browser = navigator.brave
    ? 'Brave'
    : parsedUA.getBrowser().name || 'unknown'
  const OS = parsedUA.getOS().name || ''

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

  let sessionData: SessionData
  try {
    sessionData = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
  }

  const meta: Meta = {
    sdkv: process.env.PACKAGE_VERSION,
    tz_offset: new Date().getTimezoneOffset(),
  }

  const created = parseInt(getLocal(getCreatedKey()))
  if (!isNaN(created)) {
    meta.user_id_created = created
  }

  if (sessionData) {
    if (sessionData.referrer) {
      meta.referrer = sessionData.referrer
    }

    if (sessionData.search) {
      meta.search = sessionData.search
    }
  }

  if (deviceGrain >= 1) {
    const { model, type } = getDevice(
      parsedUA.getDevice().type,
      parsedUA.getOS().name
    )
    meta.plf = getPlatform(parsedUA.getDevice().type, parsedUA.getOS().name)
    meta.appn = getDomain()
    meta.osv = parsedUA.getOS().version || '0'
    meta.appv = parsedUA.getBrowser().version || '0.0.0.0'
    meta.dmft = manufacture
    meta.dm = model
    meta.bnme = browser
    meta.dplatform = type
  }

  if (deviceGrain >= 2) {
    meta.osn = OS
  }

  return meta
}

export const getPayload = (events: EventPayload[]): Payload => {
  const payload: Payload = {
    meta: getMeta(),
  }

  if (events) {
    payload.events = events
  }

  return payload
}
