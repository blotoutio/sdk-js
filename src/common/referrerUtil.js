import { getMid, getNotSyncedDate } from '../utils'
import { constants, systemEventCode } from '../config'
import { setReferrerEvent } from '../session/navigation'
import { getEventsByDate } from '../event/storage'
import { getNotSynced } from '../session/utils'
import { getSessionForDate } from '../event/session'

const getDomainOfReferrer = (ref) => {
  const domain = ref.match(/:\/\/(.[^/]+)/)
  if (domain && domain.length > 1) {
    return domain[1]
  }

  return ref
}

export const createReferrerEventInfo = (eventName, ref, meta) => {
  const info = {
    sentToServer: false,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    value: ref
  }

  if (meta) {
    info.metaInfo = meta
  }

  return info
}

export const setReferrer = (ref) => {
  if (ref && ref !== '') {
    const refDomain = getDomainOfReferrer(ref)
    if (refDomain && refDomain !== window.location.hostname) {
      setReferrerEvent('referrer', ref)
    } else if (ref.includes(window.location.hostname)) {
      setReferrerEvent('referrer', 'none')
    }
    return
  }

  setReferrerEvent('referrer', 'none')
}

export const getPreviousDateReferrer = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkData = getEventsByDate(notSyncDate)
  if (!sdkData || !sdkData.sessions) {
    return null
  }
  const sessionId = getNotSynced(sdkData.sessions)

  const refIndex = sdkData.sessions[sessionId].eventsData.eventsInfo
    .findIndex((obj) => obj.name === 'referrer')
  if (refIndex !== -1) {
    const referrer = sdkData.sessions[sessionId].eventsData.eventsInfo[refIndex]
    referrer.sentToServer = true
    return referrer
  }

  return null
}

export const getReferrerUrlOfDateSession = (date, sessionId) => {
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return null
  }

  const eventsData = session.eventsData
  if (!eventsData || !eventsData.eventsInfo) {
    return null
  }

  const refIndex = eventsData.eventsInfo.findIndex((obj) => obj.name === 'referrer')

  if (refIndex === -1) {
    return null
  }

  return eventsData.eventsInfo[refIndex].value
}
