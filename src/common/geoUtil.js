import { getSession } from '../storage'
import { constants, manifestConst } from '../config'
import { getTempUseValue, setTempUseValue } from '../storage/sharedPreferences'
import { getManifestVariable } from '../manifest'
import { getUrl } from './endPointUrlUtil'
import { getRequest } from './networkUtil'
import { error } from './logUtil'
import { getStringDate } from './timeUtil'
import { getSessionForDate, setSessionForDate } from '../event/session'

const setGeoData = () => {
  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date)
  if (!session) {
    return
  }

  const sessionGeo = getTempUseValue(constants.GEO)
  if (!sessionGeo.geo) {
    return
  }

  session.geo = {
    conc: sessionGeo.geo.conc,
    couc: sessionGeo.geo.couc,
    reg: sessionGeo.geo.reg,
    city: sessionGeo.geo.city
  }

  setSessionForDate(date, sessionId, session)
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
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (mode && mode !== constants.PRIVACY_MODE) {
    return false
  }

  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(getStringDate(), sessionId)

  if (!sessionId || !session) {
    return false
  }

  return session.geo && session.geo.conc && mode === constants.PRIVACY_MODE
}
