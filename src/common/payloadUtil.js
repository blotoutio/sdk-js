import { constants } from './config'
import { getManifestVariable } from '../manifest'

const getMetaPayload = (meta) => {
  if (!meta) {
    return null
  }

  let deviceGrain = getManifestVariable(constants.EVENT_DEVICEINFO_GRAIN)
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

export const getPayload = (session, events) => {
  const payload = {}
  const meta = getMetaPayload(session.meta)
  if (meta && Object.keys(meta).length !== 0) {
    payload.meta = meta
  }

  if (events && events.length > 0) {
    payload.events = events
  }

  return payload
}
