import {
  constants,
  isApprox,
  isSysEvtStore,
  isDevEvtStore
} from './config'
import { setRetentionData } from './retention'
import { getLocal, getSession } from './storage'
import { checkEventsInterval, getStore, setStore } from './event/storage'
import { getRoot, updateRoot } from './storage/store'
import { getTempUseValue } from './storage/sharedPreferences'
import { checkAndGetSessionId, createSessionObject } from './session/utils'
import {
  syncPreviousDateEvents,
  syncPreviousEvents,
  setSyncEventsInterval
} from './event'
import { checkManifest, getManifestVariable } from './manifest'
import { setClientToken, setUID } from './common/uuidUtil'
import { getPreviousDateReferrer } from './common/referrerUtil'
import { createDomain, getDomain, setCustomDomain } from './common/domainUtil'
import { getStringDate } from './common/timeUtil'
import { getRootKey, setRootKey } from './storage/key'
import { getPreviousDateData, getSessionForDate, setSessionForDate } from './event/session'
import { resetPreviousDate } from './session/navigation'

const setUIDInInitEvent = () => {
  const date = getStringDate()
  const sessionId = getSession(constants.SESSION_ID)
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  const eventArr = session.eventsData.eventsInfo
  const index = findObjIndex(eventArr, 'init')
  setTimeout(() => {
    session.eventsData.eventsInfo[index].mid = getMid()
    setSessionForDate(date, session)
  })
}

export const createDaySchema = (session) => {
  const sessions = {}
  const id = getSession('sessionId')
  if (id) {
    sessions[id] = session
  }

  return {
    date: getStringDate(),
    domain: getDomain(),
    sessions,
    retentionData: ''
  }
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
  setCustomDomain(preferences.customDomain)
  setRootKey(preferences.storageRootKey)
}

export const getMid = () => {
  const domainName = getDomain()
  const userID = getTempUseValue(constants.UID)
  return `${domainName}-${userID}-${Date.now()}`
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

// TODO(nejc): we should be using helpers to get data and not use
//  localData direct access
export const initialize = (isDecryptionError) => {
  const localData = isDecryptionError ? null : getRoot()
  const hostname = getDomain()
  const date = getStringDate()
  const sessionId = checkAndGetSessionId()

  if (getLocal(getRootKey()) && localData) {
    if (localData[hostname] && !localData[hostname].events[date]) {
      const storeCheck = checkEventsInterval()
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

export const setNewDateObject = (date, eventStore) => {
  const { navigationPath, stayTimeBeforeNav } = getPreviousDateData()
  const referrer = getPreviousDateReferrer()
  resetPreviousDate()
  if (checkManifest()) {
    // old date sync events
    syncPreviousDateEvents()
  }

  const storeCheck = checkEventsInterval()
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

export const getSystemMergeCounter = (events) => {
  let sysMergeCounter = getManifestVariable(constants.EVENT_SYSTEM_MERGECOUNTER)
  if (sysMergeCounter == null) {
    sysMergeCounter = constants.DEFAULT_EVENT_SYSTEM_MERGECOUNTER
  }

  if (sysMergeCounter === '-1') {
    return (events && events.length) || 0
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
