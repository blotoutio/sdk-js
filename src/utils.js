import { postRequest } from './common/networkUtil'
import {
  callInterval,
  constants,
  isManualManifest,
  isApprox,
  isSysEvtCollect,
  isSysEvtStore,
  isDevEvtCollect,
  isDevEvtStore,
  isHighFreqEventOff,
  highFreqEvents
} from './config'
import { getNearestTimestamp } from './common/timeUtil'
import { codeForCustomCodifiedEvent } from './common/eventUtil'
import * as log from './common/logUtil'
import {
  setDailyActiveUsage,
  setMonthlyActiveUsage,
  setWeeklyActiveUsage
} from './retention'
import { getManifestUrl } from './common/endPointUrlUtil'
import { encryptRSA } from './common/securityUtil'
import { getLocal, getSession } from './storage'
import { getEventsByDate, getStore as getEventsStore, setEventsByDate, setStore as setEventsStore } from './event/storage'
import { getRoot, updateRoot } from './storage/store'
import { getTempUseValue } from './storage/sharedPreferences'
import { checkAndGetSessionId, createSessionObject, eventSync, getNotSynced } from './session/utils'
import { syncPreviousDateEvents, syncPreviousEvents, updatePreviousDayEndTime } from './session'
import { checkManifest, getManifestVariable } from './manifest'
import { createEventInfoObj } from './event/session'
import { setClientToken, setUID } from './common/uuid'
import { getPreviousDateReferrer, getReferrerUrlOfDateSession } from './common/referrer'

let globalEventInterval = null
let collectEventsArr = []
let customDomain = null
let storageRootKey = null

const createDaySchema = (session) => {
  const sessions = {}
  const id = getSession('sessionId')
  if (id) {
    sessions[id] = session
  }

  return {
    date: getDate(),
    domain: getDomain(),
    sessions,
    retentionData: ''
  }
}

export const setSyncEventsInterval = () => {
  if (!shouldSyncStoredData()) {
    return
  }

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
    const date = getDate()
    const eventStore = getEventsStore()
    if (eventStore && !eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
    } else {
      const sessionId = getSession(constants.SESSION_ID)
      const sdkDataForDate = getEventsByDate(date)
      const { events, devEvents, piiEvents, phiEvents } = getNotSyncedEvents(
        sdkDataForDate.sessions[sessionId].eventsData
      )

      sendPIIPHIEvent(piiEvents, date, 'pii')
      sendPIIPHIEvent(phiEvents, date, 'phi')

      const eventsArrChunk = eventsChunkArr(events, devEvents)
      eventsArrChunk.forEach((arr) => {
        const eventsArr = getEventPayloadArr(arr, date, sessionId)
        if (eventsArr.length === 0) {
          return
        }

        const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
        const url = getManifestUrl()
        postRequest(url, JSON.stringify(payload))
          .then(() => {
            setEventsSentToServer(arr, date, sessionId)
          })
          .catch(log.error)
      })
    }
  }, eventPushIntervalInSec)
}

const createDomain = (objectName) => {
  return {
    sharedPreference: {
      tempUse: {},
      normalUse: {},
      customUse: {}
    },
    manifest: {
      createdDate: null,
      modifiedDate: null,
      manifestData: null
    },
    retention: {
      isSynced: false,
      retentionSDK: null
    },
    events: createDateObject('init', objectName)
  }
}

const createDateObject = (event, objectName) => {
  const session = createSessionObject(event, objectName)
  const dateString = getDate()
  const obj = {}
  obj[dateString] = {
    isSynced: false,
    sdkData: createDaySchema(session)
  }
  return obj
}

const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
}

const checkStoreEventsInterval = () => {
  let storeEventsInterval = getManifestVariable(constants.STORE_EVENTS_INTERVAL)
  if (storeEventsInterval == null) {
    storeEventsInterval = constants.DEFAULT_STORE_EVENTS_INTERVAL
  }
  const eventStore = getEventsStore()
  const dateCount = Object.keys(eventStore).length
  return dateCount === parseInt(storeEventsInterval)
}

const getEventData = (eventName, event, type) => {
  const objectName = getSelector(event.target)
  if (type === 'system') {
    return createEventInfoObj(eventName, objectName, {}, event)
  }

  return createDevEventInfoObj(eventName, objectName, {}, false, false)
}

const sendEvents = (arr) => {
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const eventsArr = getEventPayloadArr(arr, date, sessionId)
  if (eventsArr.length === 0) {
    return
  }

  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => { })
    .catch(log.error)
}

const setUIDInInitEvent = () => {
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const eventArr = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
  const index = findObjIndex(eventArr, 'init')
  setTimeout(() => {
    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo[index].mid = getMid()
    setEventsByDate(date, sdkDataForDate)
  })
}

export const setInitialConfiguration = (preferences) => {
  if (!preferences) {
    return
  }

  if (!preferences.token || preferences.token.length !== 15) {
    console.error('SDK token is not valid')
    throw Error('SDK token is not valid')
  }

  setClientToken(preferences.token)
  customDomain = preferences.customDomain
  storageRootKey = preferences.storageRootKey
}

export const getRootKey = () => {
  let key = constants.ROOT_KEY
  if (storageRootKey) {
    key = storageRootKey
  }

  return `sdk${key}`
}

export const getRootIndexKey = () => {
  let key = constants.ROOT_KEY
  if (storageRootKey) {
    key = storageRootKey
  }

  return `sdk${key}Index`
}

export const createDevEventInfoObj = (eventName, objectName, meta, isPii, isPhi, duration = null) => {
  return {
    sentToServer: false,
    objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_DEV_CATEGORY,
    evcs: codeForCustomCodifiedEvent(eventName),
    duration,
    metaInfo: meta,
    isPii,
    isPhi
  }
}

export const getMid = () => {
  const domainName = getDomain()
  const userID = getTempUseValue(constants.UID)
  return `${domainName}-${userID}-${Date.now()}`
}

export const getDate = () => {
  const d = new Date()
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${date}-${month}-${year}`
}

export const getPreviousDate = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const date = yesterday.getDate()
  const month = yesterday.getMonth() + 1
  const year = yesterday.getFullYear()
  return `${date}-${month}-${year}`
}

export const findObjIndex = (eventArr, eventName) => {
  return eventArr.findIndex((obj) => obj.name === eventName)
}

export const getNotSyncedEvents = (obj) => {
  let events = []
  let devEvents = []
  let piiEvents = []
  let phiEvents = []
  if (shouldCollectSystemEvents() && obj.eventsInfo) {
    events = obj.eventsInfo.filter((evt) => !evt.sentToServer && !evt.isPii && !evt.isPhi)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    piiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPii)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    phiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPhi)
  }
  if (isDevEvtCollect && obj.devCodifiedEventsInfo) {
    devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  }
  return { events, devEvents, piiEvents, phiEvents }
}

export const getEventPayloadArr = (arr, date, sessionId) => {
  const dateEvents = getAllEventsOfDate(date)
  const sdkData = getEventsByDate(date)
  if (!sdkData || !sdkData.sessions || !sdkData.sessions[sessionId]) {
    return null
  }
  const session = sdkData.sessions[sessionId]
  const viewportLength = (session.viewPort || []).length
  const viewPortObj = viewportLength > 0 ? session.viewPort[viewportLength - 1] : {}

  const result = []
  arr.forEach((val) => {
    if (val.evn) {
      result.push(val)
      return
    }
    const propObj = {
      referrer: getReferrerUrlOfDateSession(date, sessionId),
      screen: viewPortObj,
      obj: val.objectName,
      position: val.position,
      session_id: sessionId
    }

    if (val.objectTitle) {
      propObj.objT = val.objectTitle
    }

    if (
      val.name === 'click' ||
      val.name === 'mouseover' ||
      val.name === 'hoverc' ||
      val.name === 'hover' ||
      val.name === 'dblclick'
    ) {
      if (val.extraInfo) {
        propObj.mouse = { x: val.extraInfo.mousePosX, y: val.extraInfo.mousePosY }
      }
    }

    if (val.evc === constants.EVENT_DEV_CATEGORY) {
      propObj.codifiedInfo = val.metaInfo
    }

    const eventTime = shouldApproximateTimestamp() ? getNearestTimestamp(val.tstmp) : val.tstmp
    const eventCount = dateEvents.filter((evt) => evt.name === val.name)
    const obj = {
      mid: val.mid,
      userid: getTempUseValue(constants.UID),
      evn: val.name,
      evcs: val.evcs,
      evdc: eventCount.length,
      scrn: val.urlPath,
      evt: eventTime,
      properties: propObj,
      nmo: val.nmo,
      evc: val.evc
    }

    result.push(obj)
  })
  return result
}

export const setEventsSentToServer = (arr, date, sessionId) => {
  const currentSessionId = getSession(constants.SESSION_ID)
  arr.forEach((val) => {
    const sdkDataOfDate = getEventsByDate(date)
    if (!sdkDataOfDate) {
      return
    }
    const mID = val.mid
    const evtIndex = sdkDataOfDate.sessions[sessionId].eventsData.eventsInfo
      .findIndex((obj) => obj.mid === mID)
    const devEventIndex = sdkDataOfDate.sessions[sessionId].eventsData.devCodifiedEventsInfo
      .findIndex((obj) => obj.mid === mID)

    if (evtIndex !== -1) {
      sdkDataOfDate.sessions[sessionId].eventsData.eventsInfo[evtIndex].sentToServer = true
    }
    if (devEventIndex !== -1) {
      sdkDataOfDate.sessions[sessionId].eventsData.devCodifiedEventsInfo[devEventIndex].sentToServer = true
    }
    if (currentSessionId !== sessionId) {
      sdkDataOfDate.sessions[sessionId].eventsData.sentToServer = true
    }
    setEventsByDate(date, sdkDataOfDate)
  })
  eventSync.progressStatus = false
}

export const getAllEventsOfDate = (date) => {
  const sdkDataForDate = getEventsByDate(date)
  const sessions = sdkDataForDate.sessions
  let arrEvent = []
  for (const x in sessions) {
    arrEvent = arrEvent.concat(sdkDataForDate.sessions[x].eventsData.eventsInfo)
    arrEvent = arrEvent.concat(sdkDataForDate.sessions[x].eventsData.devCodifiedEventsInfo)
  }
  return arrEvent
}

export const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

export const initialize = (isDecryptionError) => {
  const localData = isDecryptionError ? null : getRoot()
  const hostname = getDomain()
  const date = getDate()
  const sessionId = checkAndGetSessionId()

  if (getLocal(getRootKey()) && localData) {
    if (localData[hostname] && !localData[hostname].events[date]) {
      const storeCheck = checkStoreEventsInterval()
      if (checkManifest()) {
        syncPreviousDateEvents()
      }
      if (storeCheck) {
        const eventKeys = Object.keys(localData[hostname].events)
        const firstKey = eventKeys[0]
        delete localData[hostname].events[firstKey]
      }
      const session = createSessionObject(constants.INIT, constants.INIT)
      const sdkObj = createDaySchema(session)
      localData[hostname].events[date] = {
        isSynced: false,
        sdkData: sdkObj
      }
    } else {
      if (localData[hostname]) {
        if (checkManifest()) {
          syncPreviousEvents()
        }

        if (!localData[hostname].events[date].sdkData.sessions[sessionId]) {
          const session = createSessionObject(constants.INIT, constants.INIT)
          localData[hostname].events[date].sdkData.sessions[sessionId] = Object.assign(session)
        }
      } else {
        localData[hostname] = createDomain(constants.INIT)
      }
    }
    updateRoot(localData)
    setUID()
    return
  }

  const domainSchema = createDomain(constants.INIT)
  const obj = {
    domains: [hostname],
    [hostname]: domainSchema
  }
  updateRoot(obj)
  setUIDInInitEvent()
  setUID()
}

export const getDomain = () => {
  if (customDomain) {
    return customDomain
  }
  return window.location.hostname
}

export const setNewDateObject = (date, eventStore) => {
  const { navigationPath, stayTimeBeforeNav } = getPreviousDateSessionEventData()
  const referrer = getPreviousDateReferrer()
  resetPreviousDateSessionNavigation()
  if (checkManifest()) {
    // old date sync events
    syncPreviousDateEvents()
  }

  const storeCheck = checkStoreEventsInterval()
  if (storeCheck) {
    const eventKeys = Object.keys(eventStore)
    const firstKey = eventKeys[0]
    delete eventStore[firstKey]
  }

  const session = createSessionObject(constants.INIT, constants.INIT)
  session.eventsData.navigationPath = navigationPath
  session.eventsData.stayTimeBeforeNav = stayTimeBeforeNav
  if (referrer !== null) {
    session.eventsData.eventsInfo.push(referrer)
  }
  const sdkObj = createDaySchema(session)
  eventStore[date] = {
    isSynced: false,
    sdkData: sdkObj
  }

  setRetentionData()
  setSyncEventsInterval()
  setEventsStore(eventStore)
  updateRoot()
}

export const setRetentionData = () => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }
  setDailyActiveUsage()
  setWeeklyActiveUsage()
  setMonthlyActiveUsage()
}

export const getGeoPayload = (geo) => {
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

export const getMetaPayload = (meta) => {
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

export const eventsChunkArr = (events, devEvents) => {
  let codifiedMergeCounter = getManifestVariable(constants.EVENT_CODIFIED_MERGECOUNTER)
  if (codifiedMergeCounter == null) {
    codifiedMergeCounter = constants.DEFAULT_EVENT_CODIFIED_MERGECOUNTER
  }

  const sysMergeCounterValue = getSystemMergeCounter(events)
  const sysEvents = sysMergeCounterValue != null ? chunk(events, sysMergeCounterValue) : []
  const codifiedEvents = chunk(devEvents, codifiedMergeCounter)

  const length = sysEvents.length > codifiedEvents.length ? sysEvents.length : codifiedEvents.length
  const mergeArr = []
  for (let i = 0; i < length; i++) {
    let inArr = []
    if (sysEvents[i]) {
      inArr = inArr.concat(sysEvents[i])
    }
    if (codifiedEvents[i]) {
      inArr = inArr.concat(codifiedEvents[i])
    }
    mergeArr.push(inArr)
  }
  return mergeArr
}

export const syncEvents = () => {
  if (!shouldSyncStoredData()) {
    eventSync.progressStatus = false
    return
  }

  setSyncEventsInterval()
  const date = getDate()
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkDataForDate.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, date, 'pii')
  sendPIIPHIEvent(phiEvents, date, 'phi')

  const eventsArrChunk = eventsChunkArr(events, devEvents)

  eventsArrChunk.forEach((arr) => {
    const eventsArr = getEventPayloadArr(arr, date, sessionId)
    if (eventsArr.length === 0) {
      return
    }

    const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
    const url = getManifestUrl()
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(arr, date, sessionId)
      })
      .catch(log.error)
  })
}

export const sendBounceEvent = (date) => {
  const sdkDataForDate = getEventsByDate(date)
  const events = getBounceAndSessionEvents(sdkDataForDate)
  const sessionId = getSession(constants.SESSION_ID)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)

  const url = getManifestUrl()
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(log.error)
}

export const getBounceAndSessionEvents = (obj) => {
  const sessionId = getSession(constants.SESSION_ID)
  return obj.sessions[sessionId].eventsData.eventsInfo
    .filter((evt) => evt.name === constants.BOUNCE || constants.SESSION)
}

export const detectQueryString = () => {
  const currentUrl = window.location.href
  return (/\?.+=.*/g).test(currentUrl)
}

export const getObjectTitle = (event, eventName) => {
  if (
    eventName !== 'click' &&
    eventName !== 'mouseover' &&
    eventName !== 'hoverc' &&
    eventName !== 'hover' &&
    eventName !== 'dblclick'
  ) {
    return ''
  }

  const elmArr = [
    'a',
    'A',
    'button',
    'BUTTON',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ]

  if (event.target && event.target.localName) {
    const elmIndex = elmArr.findIndex((el) => el === event.target.localName)
    if (elmIndex !== -1) {
      return event.target.innerText
    }

    if (event.target.firstElementChild && event.target.firstElementChild.localName !== 'head') {
      return event.target.firstElementChild.innerText
    }
  } else if (event.target && event.target.querySelector) {
    const h1 = event.target.querySelector('h1')
    if (h1 && h1.innerText) {
      return h1.innerText
    }

    const h2 = event.target.querySelector('h2')
    if (h2 && h2.innerText) {
      return h2.innerText
    }

    const h3 = event.target.querySelector('h3')
    if (h3 && h3.innerText) {
      return h3.innerText
    }

    const h4 = event.target.querySelector('h4')
    if (h4 && h4.innerText) {
      return h4.innerText
    }

    const h5 = event.target.querySelector('h5')
    if (h5 && h5.innerText) {
      return h5.innerText
    }

    const h6 = event.target.querySelector('h6')
    if (h6 && h6.innerText) {
      return h6.innerText
    }
  }
}

export const getSelector = (ele) => {
  if (!ele) {
    return 'Unknown'
  }

  if (ele.localName) {
    return (ele.localName + (ele.id ? '#' + ele.id : '') + (ele.className ? '.' + ele.className : ''))
  }

  if (ele.nodeName) {
    return (ele.nodeName + (ele.id ? '#' + ele.id : '') + (ele.className ? '.' + ele.className : ''))
  }

  if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return 'Window'
  }

  return 'Unknown'
}

export const collectEvent = (eventName, event, type) => {
  if (isHighFreqEventOff && highFreqEvents.includes(eventName)) {
    return
  }

  collectEventsArr.push(getEventData(eventName, event, type))
  setTimeout(() => {
    const eventsArray = collectEventsArr
    collectEventsArr = []
    sendEvents(eventsArray)
  }, constants.COLLECT_TIMEOUT)
}

export const sendPIIPHIEvent = (events, date, type) => {
  if (events && events.length === 0) {
    return
  }

  const key = type === 'pii' ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const sessionId = getSession(constants.SESSION_ID)
  const sdkDataForDate = getEventsByDate(date)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const publicKey = getManifestVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify(eventsArr))

  const payload = getPayload(sdkDataForDate.sessions[sessionId])

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
    .catch(log.error)
}

export const getPreviousDateSessionEventData = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = getEventsByDate(notSyncDate)
  const sessionId = getNotSynced(sdkDataForDate.sessions)
  return sdkDataForDate.sessions[sessionId].eventsData
}

export const resetPreviousDateSessionNavigation = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = getEventsByDate(notSyncDate)
  const sessionId = getNotSynced(sdkDataForDate.sessions)
  sdkDataForDate.sessions[sessionId].eventsData.navigationPath = []
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav = []
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

export const getSystemMergeCounter = (events) => {
  let sysMergeCounter = getManifestVariable(constants.EVENT_SYSTEM_MERGECOUNTER)
  if (sysMergeCounter == null) {
    sysMergeCounter = constants.DEFAULT_EVENT_SYSTEM_MERGECOUNTER
  }

  if (sysMergeCounter === '-1') {
    return events.length
  } else if (sysMergeCounter > 0) {
    return parseInt(sysMergeCounter)
  }

  return 0
}

export const shouldSyncStoredData = () => {
  return isSysEvtStore || isDevEvtStore
}

export const getNotSyncedDate = () => {
  const obj = getEventsStore()
  let notSyncDate
  for (const x in obj) {
    notSyncDate = x
    if (!obj[x].isSynced) {
      break
    }
  }
  return notSyncDate
}

export const shouldApproximateTimestamp = () => {
  return isApprox
}

export const shouldCollectSystemEvents = () => {
  return isSysEvtCollect
}
