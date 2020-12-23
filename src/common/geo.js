import { getDate } from '../utils'
import { getSession } from '../storage'
import { constants, manifestConst } from '../config'
import { getEventsByDate, setEventsByDate, getStore } from '../event/storage'
import { getTempUseValue, setTempUseValue } from '../storage/sharedPreferences'
import { getManifestVariable } from '../manifest'
import { getUrl } from './endPointUrlUtil'
import { getRequest } from './networkUtil'
import { error } from './logUtil'

const setGeoData = () => {
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const sessionGeo = getTempUseValue(constants.GEO)
  if (!sessionGeo.geo) {
    return
  }

  sdkDataForDate.sessions[sessionId].geo = {
    conc: sessionGeo.geo.conc,
    couc: sessionGeo.geo.couc,
    reg: sessionGeo.geo.reg,
    city: sessionGeo.geo.city
  }

  setEventsByDate(date, sdkDataForDate)
}

export const setGeoDetails = () => {
  const sessionGeo = getTempUseValue(constants.GEO)
  const relativeGeoPath = getManifestVariable(constants.GEO_IP_PATH)
    ? getManifestVariable(constants.GEO_IP_PATH)
    : manifestConst.Geo_Ip_Path
  if (!sessionGeo) {
    const url = `${getUrl()}/${relativeGeoPath}`
    getRequest(url)
      .then((data) => {
        setTempUseValue(constants.GEO, data)
        setGeoData()
      })
      .catch(error)
    return
  }

  setGeoData()
}

export const checkGeo = () => {
  const eventStore = getStore()
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)

  return !!(sessionId &&
    eventStore[date].sdkData.sessions[sessionId] &&
    eventStore[date].sdkData.sessions[sessionId].geo &&
    eventStore[date].sdkData.sessions[sessionId].geo.conc &&
    mode === constants.PRIVACY_MODE)
}
