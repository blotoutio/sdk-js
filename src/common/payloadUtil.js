import { constants, isManualManifest } from '../config'
import { getManifestVariable } from '../manifest'

const getGeoPayload = (geo) => {
  if (!geo) {
    return null
  }

  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return null
  }

  let geoGrain = getManifestVariable(constants.EVENT_GEOLOCATION_GRAIN)
  if (!geoGrain) {
    geoGrain = constants.DEFAULT_EVENT_GEOLOCATION_GRAIN
  }

  if (isManualManifest) {
    return geo
  }

  const geoObject = {}
  if (geoGrain >= 1) {
    geoObject.conc = geo.conc
  }

  if (geoGrain >= 2) {
    geoObject.couc = geo.couc
  }

  if (geoGrain >= 3) {
    geoObject.reg = geo.reg
  }

  if (geoGrain >= 4) {
    geoObject.city = geo.city
  }

  return geoObject
}

const getMetaPayload = (meta) => {
  if (!meta) {
    return {}
  }

  let deviceGrain = getManifestVariable(constants.EVENT_DEVICEINFO_GRAIN)
  if (deviceGrain == null) {
    deviceGrain = constants.DEFAULT_EVENT_DEVICEINFO_GRAIN
  }
  let dmftStr = ''
  if (meta.hostOS === 'MacOS') {
    dmftStr = 'Apple'
  } else if (meta.hostOS === 'Windows') {
    dmftStr = 'Microsoft'
  } else if (meta.hostOS === 'Linux') {
    dmftStr = 'Ubuntu'
  } else if (meta.hostOS === 'UNIX') {
    dmftStr = 'UNIX'
  }
  const isIntelBased = meta.ua.includes('Intel') || meta.ua.indexOf('Intel') !== -1
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
  if (deviceGrain >= 1 || isManualManifest) {
    obj.plf = meta.plf
    obj.appn = meta.domain
    obj.osv = meta.osv
    obj.appv = meta.version
    obj.dmft = dmftStr
    obj.dm = deviceModel // Should be laptop model but for now this is ok.
    obj.bnme = meta.browser
    obj.dplatform = dplatform
  }

  if (deviceGrain >= 2 || isManualManifest) {
    obj.osn = meta.hostOS
  }

  return obj
}

export const getPayload = (session, events) => {
  const payload = {}
  const meta = getMetaPayload(session.meta)
  if (Object.keys(meta).length !== 0) {
    payload.meta = meta
  }

  const geo = getGeoPayload(session.geo)
  if (geo) {
    payload.geo = geo
  }

  if (events && events.length > 0) {
    payload.events = events
  }

  return payload
}
