import { constants } from '../common/config'
import { getSession } from '../storage'
import { getSessionDataKey } from '../storage/key'
import { info } from '../common/logUtil'
import { UAParser } from 'ua-parser-js'
import type { EventPayload } from '../typings'
import { getCreateTimestamp } from '../common/utils'

const getPlatform = (deviceType: string, OS: string) => {
  if (OS === 'iOS') {
    if (deviceType === 'tablet') {
      return 15
    } else {
      return 14 // mobile
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

const getDeviceModel = (type: string) => {
  const ua = navigator.userAgent
  const isIntelBased =
    ua && (ua.includes('Intel') || ua.indexOf('Intel') !== -1)
  if (isIntelBased) {
    return 'Intel Based'
  }

  if (type === 'mobile' || type === 'tablet') {
    return 'ARM Based'
  }

  return 'AMD Based'
}

const getMeta = () => {
  const ua = navigator.userAgent
  const parsedUA = new UAParser(ua)
  const browser = navigator.brave
    ? 'Brave'
    : parsedUA.getBrowser().name || 'unknown'
  const OS = parsedUA.getOS().name || ''

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
    case 'Unix': {
      manufacture = 'Unix'
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
    tz_offset: new Date().getTimezoneOffset() * -1,
    plf: getPlatform(parsedUA.getDevice().type, parsedUA.getOS().name),
    osv: parsedUA.getOS().version || '0',
    appv: parsedUA.getBrowser().version || '0.0.0.0',
    dmft: manufacture,
    dm: getDeviceModel(parsedUA.getDevice().type),
    bnme: browser,
    osn: OS,
    page_title: document.title,
  }

  const createdUser = getCreateTimestamp()
  if (createdUser) {
    meta.user_id_created = createdUser
  }

  if (sessionData) {
    if (sessionData.referrer) {
      meta.referrer = sessionData.referrer
    }

    if (sessionData.search) {
      meta.search = sessionData.search
    }
  }

  return meta
}

export const getPayload = (events?: EventPayload[]): Payload => {
  const payload: Payload = {
    meta: getMeta(),
  }

  if (events) {
    payload.events = events
  }

  return payload
}
