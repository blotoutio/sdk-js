import { getNotSyncedDate, setNewDateObject } from '../common/utils'
import {
  createEventInfoObj,
  getSessionForDate,
  setDevEvent,
  setSessionForDate,
} from './session'
import {
  eventsChunkArr,
  eventSync,
  getEventPayloadArr,
  sendEvents,
} from './utils'
import { getSession } from '../storage'
import { callInterval, constants } from '../common/config'
import { getEventsByDate, getStore } from './storage'
import { getManifestUrl } from '../common/endPointUrlUtil'
import { postRequest } from '../common/networkUtil'
import { error } from '../common/logUtil'
import { getManifestVariable } from '../manifest'
import { encryptRSA } from '../common/securityUtil'
import { updatePreviousDayEndTime } from '../session'
import { getNotSynced } from '../session/utils'
import { getStringDate } from '../common/timeUtil'
import { getPayload } from '../common/payloadUtil'
import { setDNTEvent } from '../session/system'

let globalEventInterval = null

export const sendPIIPHIEvent = (events, date, type) => {
  if (events && events.length === 0) {
    return
  }

  const key =
    type === 'pii' ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date, sessionId)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const publicKey = getManifestVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify(eventsArr))

  const payload = getPayload(session)

  if (type === 'pii') {
    payload.pii = obj
  } else {
    payload.phi = obj
  }

  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(error)
}

export const getNotSyncedEvents = (obj) => {
  let events = []
  let devEvents = []
  let piiEvents = []
  let phiEvents = []
  if (obj.eventsInfo) {
    events = obj.eventsInfo.filter(
      (evt) => !evt.sentToServer && !evt.isPii && !evt.isPhi
    )
  }
  if (obj.devCodifiedEventsInfo) {
    piiEvents = obj.devCodifiedEventsInfo.filter(
      (evt) => !evt.sentToServer && evt.isPii
    )
  }
  if (obj.devCodifiedEventsInfo) {
    phiEvents = obj.devCodifiedEventsInfo.filter(
      (evt) => !evt.sentToServer && evt.isPhi
    )
  }
  if (obj.devCodifiedEventsInfo) {
    devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  }
  return { events, devEvents, piiEvents, phiEvents }
}

export const setSyncEventsInterval = () => {
  let eventPushInterval = getManifestVariable(constants.EVENT_PUSH_INTERVAL)
  if (eventPushInterval == null) {
    eventPushInterval = constants.DEFAULT_EVENT_PUSH_INTERVAL
  }
  eventPushInterval = eventPushInterval || callInterval
  const eventPushIntervalInSec = eventPushInterval * 60 * 60 * 1000
  if (globalEventInterval) {
    clearInterval(globalEventInterval)
  }
  globalEventInterval = setInterval(() => {
    const date = getStringDate()
    const eventStore = getStore()
    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
    } else {
      syncEvents()
    }
  }, eventPushIntervalInSec)
}

export const setEventsSentToServer = (arr, date, sessionId) => {
  const currentSessionId = getSession(constants.SESSION_ID)
  arr.forEach((val) => {
    const session = getSessionForDate(date, sessionId)
    if (!session) {
      return
    }
    const mID = val.mid
    const evtIndex = session.eventsData.eventsInfo.findIndex(
      (obj) => obj.mid === mID
    )
    const devEventIndex = session.eventsData.devCodifiedEventsInfo.findIndex(
      (obj) => obj.mid === mID
    )

    if (evtIndex !== -1) {
      session.eventsData.eventsInfo[evtIndex].sentToServer = true
    }
    if (devEventIndex !== -1) {
      session.eventsData.devCodifiedEventsInfo[
        devEventIndex
      ].sentToServer = true
    }
    if (currentSessionId !== sessionId) {
      session.eventsData.sentToServer = true
    }
    setSessionForDate(date, sessionId, session)
  })
  eventSync.progressStatus = false
}

export const syncEvents = (sessionId, date) => {
  setSyncEventsInterval()
  if (!date) {
    date = getStringDate()
  }

  if (!sessionId) {
    sessionId = getSession(constants.SESSION_ID)
  }

  let eventsArrayChunk = []
  const session = getSessionForDate(date, sessionId)
  if (session && session.eventsData) {
    const { events, devEvents, piiEvents, phiEvents } = getNotSyncedEvents(
      session.eventsData
    )

    sendPIIPHIEvent(piiEvents, date, 'pii')
    sendPIIPHIEvent(phiEvents, date, 'phi')
    eventsArrayChunk = eventsChunkArr(events, devEvents)
  }

  eventsArrayChunk.forEach((arr) => {
    const eventsArr = getEventPayloadArr(arr, date, sessionId)
    if (eventsArr.length === 0) {
      return
    }

    const payload = getPayload(session, eventsArr)
    const url = getManifestUrl()
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(arr, date, sessionId)
      })
      .catch(error)
  })
}

export const syncPreviousEvents = () => {
  const date = getStringDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  const sessionId = getNotSynced(sdkData.sessions)
  const currentSessionId = getSession(constants.SESSION_ID).toString()
  if (!sessionId || currentSessionId === sessionId) {
    return
  }

  syncEvents(sessionId, date)
}

export const syncPreviousDateEvents = () => {
  const date = getNotSyncedDate()
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions) {
    return
  }

  const sessionId = getNotSynced(sdkData.sessions)
  if (!sessionId) {
    return
  }
  syncEvents(sessionId, date)
}

export const mapIDEvent = (id, provider, data) => {
  if (!id) {
    error('ID mapping is missing id')
    return
  }

  if (!data) {
    data = {}
  }

  data.map_id = id
  data.map_provider = provider

  setDevEvent(constants.MAP_ID_EVENT, data, constants.MAP_ID_EVENT_CODE)
}

export const sendStartEvent = () => {
  sendEvents([createEventInfoObj('sdk_start')])

  if (window.doNotTrack || navigator.doNotTrack) {
    if (
      window.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes' ||
      navigator.doNotTrack === '1'
    ) {
      setDNTEvent()
    }
  }
}
