import {
  constants,
  isManualManifest,
  isApprox,
  isSysEvtStore,
  isDevEvtStore
} from './config'
import { setRetentionData } from './retention'
import { getLocal, getSession } from './storage'
import { getEventsByDate, getStore, setEventsByDate, setStore } from './event/storage'
import { getRoot, updateRoot } from './storage/store'
import { getTempUseValue } from './storage/sharedPreferences'
import { checkAndGetSessionId, createSessionObject, getNotSynced } from './session/utils'
import {
  syncPreviousDateEvents,
  syncPreviousEvents,
  setSyncEventsInterval
} from './event'
import { checkManifest, getManifestVariable } from './manifest'
import { setClientToken, setUID } from './common/uuid'
import { getPreviousDateReferrer } from './common/referrer'

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

const checkStoreEventsInterval = () => {
  let storeEventsInterval = getManifestVariable(constants.STORE_EVENTS_INTERVAL)
  if (storeEventsInterval == null) {
    storeEventsInterval = constants.DEFAULT_STORE_EVENTS_INTERVAL
  }
  const eventStore = getStore()
  const dateCount = Object.keys(eventStore).length
  return dateCount === parseInt(storeEventsInterval)
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
  setStore(eventStore)
  updateRoot()
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
  const obj = getStore()
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
