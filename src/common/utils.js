import { constants } from './config'
import { getSession } from '../storage'
import { checkEventsInterval, getStore, setStore } from '../event/storage'
import { updateRoot } from '../storage/store'
import { getTempUseValue } from '../storage/sharedPreferences'
import { createSessionObject } from '../session/utils'
import { syncPreviousDateEvents, setSyncEventsInterval } from '../event'
import { checkManifest, getManifestVariable } from '../manifest'
import { getPreviousDateReferrer } from './referrerUtil'
import { getDomain } from './domainUtil'
import { getStringDate } from './timeUtil'
import { getPreviousDateData } from '../event/session'
import { resetPreviousDate } from '../session/navigation'

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
  }
}

export const getMid = () => {
  const domainName = getDomain()
  const userID = getTempUseValue(constants.UID)
  return `${domainName}-${userID}-${Date.now()}`
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

  const session = createSessionObject()
  session.eventsData.navigationPath = navigationPath
  session.eventsData.stayTimeBeforeNav = stayTimeBeforeNav
  if (referrer !== null) {
    session.eventsData.eventsInfo.push(referrer)
  }
  const sdkObj = createDaySchema(session)
  eventStore[date] = {
    isSynced: false,
    sdkData: sdkObj,
  }

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
    'h6',
  ]

  if (event.target && event.target.localName) {
    const elmIndex = elmArr.findIndex((el) => el === event.target.localName)
    if (elmIndex !== -1) {
      return event.target.innerText
    }

    if (
      event.target.firstElementChild &&
      event.target.firstElementChild.localName !== 'head'
    ) {
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
    return (
      ele.localName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
  }

  if (ele.nodeName) {
    return (
      ele.nodeName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
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
