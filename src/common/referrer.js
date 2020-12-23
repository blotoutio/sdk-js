import { getMid, getNotSyncedDate } from '../utils'
import { constants, systemEventCode } from '../config'
import { setReferrerEvent } from '../session/navigation'
import { getEventsByDate } from '../storage/event'
import { getNotSynced } from '../session/utils'

const getDomainOfReferrer = (ref) => {
  const domain = ref.match(/:\/\/(.[^/]+)/)
  if (domain && domain.length > 1) {
    return domain[1]
  }

  return ref
}

export const createReferrerEventInfo = (eventName, ref, meta = {}) => {
  return {
    sentToServer: false,
    objectName: '',
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position: { x: -1, y: -1, width: -1, height: -1 },
    metaInfo: meta,
    value: ref,
    objectTitle: ''
  }
}

export const setReferrer = (ref) => {
  if (ref && ref !== '') {
    const refDomain = getDomainOfReferrer(ref)
    if (refDomain && refDomain !== window.location.hostname) {
      setReferrerEvent('referrer', ref, {})
    } else if (ref.includes(window.location.hostname)) {
      setReferrerEvent('referrer', 'none', {})
    }
    return
  }

  setReferrerEvent('referrer', 'none', {})
}

export const getPreviousDateReferrer = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = getEventsByDate(notSyncDate)
  const sessionId = getNotSynced(sdkDataForDate.sessions)

  const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === 'referrer')
  if (refIndex !== -1) {
    const referrer = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo[refIndex]
    referrer.sentToServer = true
    return referrer
  }

  return null
}

export const getReferrerUrlOfDateSession = (date, sessionId) => {
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return null
  }

  const eventsData = sdkData.sessions[sessionId].eventsData
  if (!eventsData || !eventsData.eventsInfo) {
    return null
  }

  const refIndex = eventsData.eventsInfo
    .findIndex((obj) => obj.name === 'referrer')

  if (refIndex === -1) {
    return null
  }

  return eventsData.eventsInfo[refIndex].value
}
