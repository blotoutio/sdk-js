import { getRequest, postRequest } from './common/networkUtil'
import {
  callInterval,
  constants,
  manifestConst,
  systemEventCode,
  isManualManifest,
  isApprox,
  isSysEvtCollect,
  isSysEvtStore,
  isDevEvtCollect,
  isDevEvtStore,
  isHighFreqEventOff,
  highFreqEvents
} from './config'
import { getNearestTimestamp, millisecondsToHours } from './common/timeUtil'
import { codeForCustomCodifiedEvent } from './common/eventUtil'
import * as log from './common/logUtil'
import { getOS } from './common/systemUtil'
import * as retention from './common/retentionUtil'
import {
  syncPreviousSessionEvents,
  getNotSyncedSession,
  updatePreviousDayEndTime,
  checkAndGetSessionId,
  setReferrerEvent,
  addSessionInfoEvent
} from './common/sessionUtil'
import * as storage from './common/storageUtil'
import { v4 as uuidv4 } from 'uuid'
import { getUrl, getManifestUrl } from './common/endPointUrlUtil'
import { encryptRSA, SHA256Encode } from './common/securityUtil'

let globalRetentionInterval = null
let globalEventInterval = null
let collectEventsArr = []
let staticUserID = null
let staticClientToken = null
let customDomain = null
let storageRootKey = null

const createDaySchema = (session) => {
  const sessions = {}
  const id = storage.getSessionData('sessionId')
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

const createSessionObject = (eventName, objectName) => {
  return {
    startTime: Date.now(),
    endTime: '',
    lastServerSyncTime: '',
    sdkVersion: process.env.PACKAGE_VERSION,
    geo: {},
    meta: createMetaObject(),
    viewPort: [createViewPortObject()],
    eventsData: {
      eventsInfo: [createEventInfoObj(eventName, objectName)],
      navigationPath: [window.location.href],
      stayTimeBeforeNav: [],
      devCodifiedEventsInfo: [],
      sentToServer: false
    }
  }
}

const createMetaObject = () => {
  const userAgent = navigator.userAgent
  const osDtl = getOS()
  const details = getBrowser(userAgent)
  const plf = mobileCheck() ? constants.MOBILE_PLATFORM_CODE : constants.WEB_PLATFORM_CODE

  const data = {
    plf: plf,
    domain: getDomain(),
    osv: osDtl.version,
    hostOS: findOS(),
    browser: details.name,
    dplatform: getDeviceType(),
    ua: navigator.userAgent
  }

  if (details.version) {
    data.version = details.version
  }

  return data
}

const getPositionObject = (event) => {
  let height = -1
  let width = -1
  if (event && event.srcElement) {
    if (event.srcElement.offsetHeight) {
      height = event.srcElement.offsetHeight
    }

    if (event.srcElement.offsetWidth) {
      width = event.srcElement.offsetWidth
    }
  }

  let x = -1
  let y = -1
  if (event.screenX != null && event.offsetX != null) {
    x = event.screenX - event.offsetX
  }

  if (event.screenY != null && event.offsetY != null) {
    y = event.screenY - event.offsetY
  }

  return { x, y, width, height }
}

const findOS = () => {
  let curOS = ''
  if (navigator.appVersion.indexOf('Win') !== -1) curOS = 'Windows'
  if (navigator.appVersion.indexOf('Mac') !== -1) curOS = 'MacOS'
  if (navigator.appVersion.indexOf('X11') !== -1) curOS = 'UNIX'
  if (navigator.appVersion.indexOf('Linux') !== -1) curOS = 'Linux'
  return curOS
}

export const getBrowser = (userAgent) => {
  if ((/ucbrowser/i).test(userAgent)) {
    return { name: 'UCBrowser', version: browserVersion(userAgent, /(ucbrowser)\/([\d]+)/i) }
  }
  if ((/edg/i).test(userAgent)) {
    return { name: 'Edge', version: browserVersion(userAgent, /(edge|edga|edgios|edg)\/([\d]+)/i) }
  }
  if ((/googlebot/i).test(userAgent)) {
    return { name: 'GoogleBot', version: browserVersion(userAgent, /(googlebot)\/([\d]+)/i) }
  }
  if ((/chromium/i).test(userAgent)) {
    return { name: 'Chromium', version: browserVersion(userAgent, /(chromium)\/([\d]+)/i) }
  }
  if ((/firefox|fxios/i).test(userAgent) && !(/seamonkey/i).test(userAgent)) {
    return { name: 'Firefox', version: browserVersion(userAgent, /(firefox|fxios)\/([\d]+)/i) }
  }
  if ((/msie|trident/i).test(userAgent) && !(/ucbrowser/i).test(userAgent)) {
    const version = browserVersion(userAgent, /(trident)\/([\d]+)/i)
    // IE version is mapped using trident version
    // IE/8.0 = Trident/4.0, IE/9.0 = Trident/5.0
    return version ? { name: 'IE', version: parseFloat(version) + 4.0 } : { name: 'IE', version: 7.0 }
  }
  if ((/chrome|crios/i).test(userAgent) && !(/opr|opera|chromium|edg|ucbrowser|googlebot/i).test(userAgent)) {
    const browser = navigator.brave ? 'Brave' : 'Chrome'
    return { name: browser, version: browserVersion(userAgent, /(chrome|crios)\/([\d]+)/i) }
  }
  if ((/safari/i).test(userAgent) && !(/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i).test(userAgent)) {
    return { name: 'Safari', version: browserVersion(userAgent, /(safari)\/([\d]+)/i) }
  }
  if ((/opr|opera/i).test(userAgent)) {
    return { name: 'Opera', version: browserVersion(userAgent, /(opera|opr)\/([\d]+)/i) }
  }
  if ((/SamsungBrowser/i).test(userAgent)) {
    return { name: 'Samsung Internet for Android', version: browserVersion(userAgent, /(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/Whale/i).test(userAgent)) {
    return { name: 'NAVER Whale Browser', version: browserVersion(userAgent, /(?:whale)[\s/](\d+(?:\.\d+)+)/i) }
  }
  if ((/MZBrowser/i).test(userAgent)) {
    return { name: 'MZ Browser', version: browserVersion(userAgent, /(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i) }
  }
  if ((/focus/i).test(userAgent)) {
    return { name: 'Focus', version: browserVersion(userAgent, /(?:focus)[\s/](\d+(?:\.\d+)+)/i) }
  }
  if ((/swing/i).test(userAgent)) {
    return { name: 'Swing', version: browserVersion(userAgent, /(?:swing)[\s/](\d+(?:\.\d+)+)/i) }
  }
  if ((/coast/i).test(userAgent)) {
    return { name: 'Opera Coast', version: browserVersion(userAgent, /(?:coast)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/opt\/\d+(?:.?_?\d+)+/i).test(userAgent)) {
    return { name: 'Opera Touch', version: browserVersion(userAgent, /(?:opt)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/yabrowser/i).test(userAgent)) {
    return { name: 'Yandex Browser', version: browserVersion(userAgent, /(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/ucbrowser/i).test(userAgent)) {
    return { name: 'UC Browser', version: browserVersion(userAgent, /(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/Maxthon|mxios/i).test(userAgent)) {
    return { name: 'Maxthon', version: browserVersion(userAgent, /(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/epiphany/i).test(userAgent)) {
    return { name: 'Epiphany', version: browserVersion(userAgent, /(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/puffin/i).test(userAgent)) {
    return { name: 'Puffin', version: browserVersion(userAgent, /(?:puffin)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/sleipnir/i).test(userAgent)) {
    return { name: 'Sleipnir', version: browserVersion(userAgent, /(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/k-meleon/i).test(userAgent)) {
    return { name: 'K-Meleon', version: browserVersion(userAgent, /(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/micromessenger/i).test(userAgent)) {
    return { name: 'WeChat', version: browserVersion(userAgent, /(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/qqbrowser/i).test(userAgent)) {
    return { name: 'QQ Browser', version: browserVersion(userAgent, /(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/vivaldi/i).test(userAgent)) {
    return { name: 'Vivaldi', version: browserVersion(userAgent, /vivaldi\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/seamonkey/i).test(userAgent)) {
    return { name: 'SeaMonkey', version: browserVersion(userAgent, /seamonkey\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/sailfish/i).test(userAgent)) {
    return { name: 'Sailfish', version: browserVersion(userAgent, /sailfish\s?browser\/(\d+(\.\d+)?)/i) }
  }
  if ((/silk/i).test(userAgent)) {
    return { name: 'Amazon Silk', version: browserVersion(userAgent, /silk\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/phantom/i).test(userAgent)) {
    return { name: 'PhantomJS', version: browserVersion(userAgent, /phantomjs\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/slimerjs/i).test(userAgent)) {
    return { name: 'SlimerJS', version: browserVersion(userAgent, /slimerjs\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/blackberry|\bbb\d+/i).test(userAgent)) {
    return { name: 'BlackBerry', version: browserVersion(userAgent, /blackberry[\d]+\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/(web|hpw)[o0]s/i).test(userAgent)) {
    return { name: 'WebOS Browser', version: browserVersion(userAgent, /w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/bada/i).test(userAgent)) {
    return { name: 'Bada', version: browserVersion(userAgent, /dolfin\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/tizen/i).test(userAgent)) {
    return { name: 'Tizen', version: browserVersion(userAgent, /(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/qupzilla/i).test(userAgent)) {
    return { name: 'QupZilla', version: browserVersion(userAgent, /(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i) }
  }
  if ((/electron/i).test(userAgent)) {
    return { name: 'Electron', version: browserVersion(userAgent, /(?:electron)\/(\d+(\.?_?\d+)+)/i) }
  }
  if ((/MiuiBrowser/i).test(userAgent)) {
    return { name: 'Miui', version: browserVersion(userAgent, /(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i) }
  }

  return { name: 'unknown', version: '0.0.0.0' }
}

const browserVersion = (userAgent, regex) => {
  return userAgent.match(regex) ? userAgent.match(regex)[2] : null
}

const syncPreviousDateEvents = () => {
  if (!isSysEvtStore && !isDevEvtStore) {
    return
  }

  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = storage.getEventsSDKDataForDate(notSyncDate)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)
  const { events, devEvents, piiEvents, phiEvents } =
    getNotSyncedEvents(sdkDataForDate.sessions[sessionId].eventsData)

  sendPIIPHIEvent(piiEvents, notSyncDate, 'pii')
  sendPIIPHIEvent(phiEvents, notSyncDate, 'phi')

  let eventsArrChunk = eventsChunkArr(events, devEvents)
  eventsArrChunk = addSessionInfoEvent(events, eventsArrChunk, notSyncDate, sessionId)
  sendNavigation(notSyncDate, sessionId)
  eventsArrChunk.forEach((arr) => {
    const eventsArray = getEventPayloadArr(arr, notSyncDate, sessionId)
    if (eventsArray.length === 0) {
      return
    }

    const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArray)
    const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(arr, notSyncDate, sessionId)
      })
      .catch(log.error)
  })
}

const getNotSyncedDate = () => {
  const obj = storage.getEventsStore()
  let notSyncDate
  for (const x in obj) {
    notSyncDate = x
    if (!obj[x].isSynced) {
      break
    }
  }
  return notSyncDate
}

const setSyncEventsInterval = () => {
  if (!isSysEvtStore && !isDevEvtStore) {
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
    const eventStore = storage.getEventsStore()
    if (!eventStore[date]) {
      updatePreviousDayEndTime()
      setNewDateObject(date, eventStore)
    } else {
      const sessionId = storage.getSessionData(constants.SESSION_ID)
      const sdkDataForDate = storage.getEventsSDKDataForDate(date)
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
        const url = getManifestUrl(
          constants.EVENT_PATH,
          manifestConst.Event_Path
        )
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

const setManifestData = (data) => {
  storage.setManifestCreatedDate(Date.now())
  storage.setManifestModifiedDate(Date.now())
  storage.setManifestDataStore(data)
  setRetentionObject()
  storage.updateStore()
}

const setManifestRefreshInterval = () => {
  const url = `${getUrl()}/${manifestConst.MANIFEST_PATH}`
  const payload = JSON.stringify({
    lastUpdatedTime: 0,
    bundleId: getDomain()
  })
  const manifestRefData = getManifestVariable(constants.MANIFEST_REFRESH_INTERVAL)
  const manifestIntervalInMSec = manifestRefData
    ? manifestRefData * 60 * 60 * 1000
    : callInterval
  if (globalRetentionInterval) {
    clearInterval(globalRetentionInterval)
  }
  globalRetentionInterval = setInterval(() => {
    postRequest(url, payload)
      .then((data) => {
        setManifestData(data)
        setManifestRefreshInterval()
        setSyncEventsInterval()
      })
      .catch((error) => {
        log.error(error)
      })
  }, manifestIntervalInMSec)
}

const mobileCheck = () => {
  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
              a.substr(0, 4)
            )
    ) { check = true }
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

export const getDeviceType = () => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile'
  }
  return 'desktop'
}

const setGeoData = () => {
  const date = getDate()
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const sessionGeo = storage.getValueFromSPTempUseStore(constants.GEO)
  if (!sessionGeo.geo) {
    return
  }

  sdkDataForDate.sessions[sessionId].geo = {
    conc: sessionGeo.geo.conc,
    couc: sessionGeo.geo.couc,
    reg: sessionGeo.geo.reg,
    city: sessionGeo.geo.city
  }

  storage.setEventsSDKDataForDate(date, sdkDataForDate)
  storage.updateStore()
}

const syncRetentionData = () => {
  try {
    const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
    if (!mode || mode === constants.FIRSTPARTY_MODE) {
      return
    }

    const retentionStore = storage.getRetentionSDKData()
    let arr = []
    Object.keys(retentionStore.retentionData).forEach((key) => {
      const res = getNotSyncObj(retentionStore.retentionData[key])
      if (res && res.length > 0) {
        const payloadArr = getRetentionPayloadArr(res, key)
        arr = arr.concat(payloadArr)
      }
    })

    if (arr.length === 0) {
      return
    }

    const date = getDate()
    const sessionId = storage.getSessionData(constants.SESSION_ID)
    const sdkDataForDate = storage.getEventsSDKDataForDate(date)
    const valueFromSPTempUseStore = storage.getValueFromSPCustomUseStore(constants.PREVIOUS_RETENTION_META)
    const payload = getPayload(sdkDataForDate.sessions[sessionId], arr)

    if (valueFromSPTempUseStore) {
      payload.pmeta = getPmeta(payload.meta, valueFromSPTempUseStore)
    }

    const url = getManifestUrl(constants.EVENT_RETENTION_PATH, manifestConst.Event_Retention_Path)
    const tempUseData = storage.getValueFromSPTempUseStore(constants.FAILED_RETENTION)
    let isTodayDate = false
    if (tempUseData) {
      Object.keys(tempUseData).forEach((val) => {
        if (val === date) {
          isTodayDate = true
        }

        sendRetentionReq(url, retentionStore, tempUseData[val], val)
      })
    }

    if (!isTodayDate) {
      sendRetentionReq(url, retentionStore, payload, '')
    }
  } catch (error) {
    log.info(error)
  }
}

const sendRetentionReq = (url, retentionStore, payload, date) => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }

  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setSendtoServer(retentionStore, payload.events)
      storage.setValueInSPCustomUseStore(constants.PREVIOUS_RETENTION_META, payload.meta)

      const tempUseData = storage.getValueFromSPTempUseStore(constants.FAILED_RETENTION)
      if (date && tempUseData[date]) {
        delete tempUseData[date]
      }
      storage.setValueInSPTempUseStore(constants.FAILED_RETENTION, tempUseData)

      storage.updateStore()
    })
    .catch(() => {
      const date = getDate()
      let tempUseData = storage.getValueFromSPTempUseStore(constants.FAILED_RETENTION)
      if (!tempUseData) {
        tempUseData = {}
      }

      if (!tempUseData[date]) {
        tempUseData[date] = payload
      }
      storage.setValueInSPTempUseStore(constants.FAILED_RETENTION, tempUseData)
      storage.updateStore()
    })
}

const setSendtoServer = (retentionStore, events) => {
  events.forEach((val) => {
    if (!val) {
      return
    }
    const mid = val.mid
    const key = val.evn === constants.DNU ? constants.IS_NEW_USER : val.evn
    if (!Array.isArray(retentionStore.retentionData[key])) {
      retentionStore.retentionData[key].sentToServer = true
      return
    }
    const objIdx = retentionStore.retentionData[key].findIndex((obj) => obj.mid === mid)
    retentionStore.retentionData[key][objIdx].sentToServer = true
  })
  storage.setRetentionSDKData(retentionStore)
}

const getNotSyncObj = (array) => {
  if (Array.isArray(array)) {
    return array.filter((evt) => !evt.sentToServer)
  }

  if (typeof array === 'object' && !array.sentToServer) {
    return [array]
  }
}

const getPmeta = (obj1, obj2) => {
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1
  }

  const diffs = {}
  let key

  /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
  const arraysMatch = (arr1, arr2) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }

    // Otherwise, return true
    return true
  }

  /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
  const compare = (item1, item2, key) => {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1)
    const type2 = Object.prototype.toString.call(item2)

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null
      return
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2
      return
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2)
      if (Object.keys(objDiff).length > 1) {
        diffs[key] = objDiff
      }
      return
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2
      }
      return
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2
      }
    }
  }

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1[key]) {
      compare(obj1[key], obj2[key], key)
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2[key]) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key]
      }
    }
  }

  // Return the object of differences
  return diffs
}

const getRetentionPayloadArr = (arr, name) => {
  const eventName = name === constants.IS_NEW_USER ? constants.DNU : name
  const result = []
  const UID = storage.getValueFromSPTempUseStore(constants.UID)
  arr.forEach((val) => {
    const eventTime = isApprox ? getNearestTimestamp(val.tstmp) : val.tstmp
    const data = {
      mid: val.mid,
      userid: UID,
      evn: eventName,
      evcs: val.evcs,
      evt: eventTime,
      nmo: val.nmo,
      evc: val.evc
    }

    if (val.avgtime) {
      data.tst = val.avgtime
    }
    result.push(data)
  })

  return result
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
  const eventStore = storage.getEventsStore()
  const dateCount = Object.keys(eventStore).length
  return dateCount === parseInt(storeEventsInterval)
}

const removeEmptyValue = (array) => {
  return array.filter((el) => el != null && el !== '')
}

const getDomainOfReferrer = (ref) => {
  const domain = ref.match(/:\/\/(.[^/]+)/)
  if (domain && domain.length > 1) {
    return domain[1]
  }

  return ref
}

const getNavigationPayloadArr = (navigations, navigationsTime) => {
  const UID = storage.getValueFromSPTempUseStore(constants.UID)
  const eventTime = isApprox ? getNearestTimestamp(Date.now()) : Date.now()
  return [{
    mid: getMid(),
    userid: UID,
    evn: constants.NAVIGATION,
    evcs: systemEventCode[constants.NAVIGATION],
    evdc: 1,
    scrn: window.location.href,
    evt: eventTime,
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    nvg: navigations,
    nvg_tm: navigationsTime
  }]
}

const userIDUUID = () => {
  if (staticUserID) {
    return staticUserID
  }

  const userUUID = storage.getValueFromSPTempUseStore(constants.UID)
  if (userUUID) {
    staticUserID = userUUID
    return staticUserID
  }

  const startTime = Date.now()
  if (!staticClientToken) {
    return staticUserID
  }

  const initialUUID = uuidv4()
  const randomNum10Digit1 = Math.floor(100000000 + Math.random() * 900000000)
  const randomNum10Digit2 = Math.floor(100000000 + Math.random() * 900000000)
  const finalString = startTime + staticClientToken + initialUUID + randomNum10Digit1 + randomNum10Digit2 + Date.now()
  // finalString - "15994815055548B7PNST7CGHSF4N0a624583-c8d9-41c5-a328-43b84408fb4a8127742871616933301599481509479"

  const sha64Char = SHA256Encode(finalString) // "38c646a0c2c42534507bd19508ebde2c326bbd5a0415a766a555dd1d9656c5ae"
  staticUserID = convertTo64CharUUID(sha64Char)
  return staticUserID
}

const convertTo64CharUUID = (stringToConvert) => {
  const lengths = [16, 8, 8, 8, 24]
  const parts = []
  let range = 0
  for (let i = 0; i < lengths.length; i++) {
    parts.push(stringToConvert.slice(range, range + lengths[i]))
    range += lengths[i]
  }

  return parts.join('-')
}

const setUID = () => {
  const tempUseData = storage.getValueFromSPTempUseStore(constants.UID)
  if (!tempUseData) {
    const userID = userIDUUID()
    updateIndexScore(userID, true)
    storage.setValueInSPTempUseStore(constants.UID, userID)
    storage.updateStore()
    return
  }

  setTimeout(() => {
    updateIndexScore(tempUseData, false)
  }, 500)
}

const updateIndexScore = (indexValueToSet, isFirstIndex) => {
  let sdkIndexData = storage.getLocalData(getRootIndexKey())
  if (sdkIndexData) {
    // why 1056: 68+36+68+68+68+68+68+68+68+68+68+68+68+68+68+68 = 1056
    if (sdkIndexData.length >= 1056) {
      indexValueToSet = convertTo64CharUUID(SHA256Encode(indexValueToSet))
      sdkIndexData = indexValueToSet
      isFirstIndex = true
    }
  } else {
    indexValueToSet = convertTo64CharUUID(SHA256Encode(indexValueToSet))
    sdkIndexData = indexValueToSet
  }

  let prePostUUID = uuidv4()
  if (!isFirstIndex) {
    prePostUUID = SHA256Encode(prePostUUID)
    prePostUUID = convertTo64CharUUID(prePostUUID)
  }

  const idLengthHalf = prePostUUID.length / 2
  const preUUID = prePostUUID.substr(0, idLengthHalf)
  const postUUID = prePostUUID.substr(idLengthHalf)
  const indexStoreStr = preUUID + sdkIndexData + postUUID
  storage.setLocalData(getRootIndexKey(), indexStoreStr)
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
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const eventsArr = getEventPayloadArr(arr, date, sessionId)
  if (eventsArr.length === 0) {
    return
  }

  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)
  const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
  postRequest(url, JSON.stringify(payload))
    .then(() => { })
    .catch(log.error)
}

const setUIDInInitEvent = () => {
  const date = getDate()
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const eventArr = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
  const index = findObjIndex(eventArr, 'init')
  setTimeout(() => {
    sdkDataForDate.sessions[sessionId].eventsData.eventsInfo[index].mid = getMid()
    storage.setEventsSDKDataForDate(date, sdkDataForDate)
  })
}

const setRetentionObject = () => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }
  storage.setRetentionSDKData(retention.create())
  storage.updateStore()
}

export const setInitialConfiguration = (preferences) => {
  if (!preferences) {
    return
  }

  if (!preferences.token || preferences.token.length !== 15) {
    console.error('SDK token is not valid')
    throw Error('SDK token is not valid')
  }

  staticClientToken = preferences.token
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

export const createViewPortObject = () => {
  return {
    timeStamp: Date.now(),
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    docHeight: document.documentElement.scrollHeight,
    docWidth: document.documentElement.scrollWidth
  }
}

export const createEventInfoObj = (eventName, objectName, meta = {}, event = {}) => {
  return {
    sentToServer: false,
    objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: storage.getRootStore() ? getMid() : '',
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position: getPositionObject(event),
    metaInfo: meta,
    objectTitle: getObjectTitle(event, eventName),
    extraInfo: {
      mousePosX: event.clientX,
      mousePosY: event.clientY
    }
  }
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

export const createRefEventInfoObj = (eventName, ref, meta = {}) => {
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

export const getMid = () => {
  const domainName = getDomain()
  const userID = storage.getValueFromSPTempUseStore(constants.UID)
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

export const isEventExist = (eventArr, eventName) => {
  return !!eventArr.find((obj) => obj.name === eventName)
}

export const findObjIndex = (eventArr, eventName) => {
  return eventArr.findIndex((obj) => obj.name === eventName)
}

export const setGeoDetails = () => {
  const sessionGeo = storage.getValueFromSPTempUseStore(constants.GEO)
  const relativeGeoPath = getManifestVariable(constants.GEO_IP_PATH)
    ? getManifestVariable(constants.GEO_IP_PATH)
    : manifestConst.Geo_Ip_Path
  if (!sessionGeo) {
    const url = `${getUrl()}/${relativeGeoPath}`
    getRequest(url)
      .then((data) => {
        storage.setValueInSPTempUseStore(constants.GEO, data)
        setGeoData()
      })
      .catch(log.error)
    return
  }

  setGeoData()
}

export const getNotSyncedEvents = (obj) => {
  let events = []
  let devEvents = []
  let piiEvents = []
  let phiEvents = []
  if (isSysEvtCollect) {
    events = obj.eventsInfo.filter((evt) => !evt.sentToServer && !evt.isPii && !evt.isPhi)
  }
  if (isDevEvtCollect) {
    piiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPii)
  }
  if (isDevEvtCollect) {
    phiEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer && evt.isPhi)
  }
  if (isDevEvtCollect) {
    devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  }
  return { events, devEvents, piiEvents, phiEvents }
}

export const getNotSyncedEventsCount = (obj) => {
  let events = obj.eventsInfo.filter((evt) => !evt.sentToServer)
  const devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  events = events.concat(devEvents)
  return events.length
}

export const getEventPayloadArr = (arr, date, sessionId) => {
  const dateEvents = getAllEventsOfDate(date)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const viewportLen = sdkDataForDate.sessions[sessionId].viewPort.length
  const viewPortObj = sdkDataForDate.sessions[sessionId].viewPort[viewportLen - 1]

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

    const eventTime = isApprox ? getNearestTimestamp(val.tstmp) : val.tstmp
    const eventCount = dateEvents.filter((evt) => evt.name === val.name)
    const obj = {
      mid: val.mid,
      userid: storage.getValueFromSPTempUseStore(constants.UID),
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
  const currentSessionId = storage.getSessionData(constants.SESSION_ID)
  arr.forEach((val) => {
    const sdkDataOfDate = storage.getEventsSDKDataForDate(date)
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
    storage.setEventsSDKDataForDate(date, sdkDataOfDate)
    storage.updateStore()
  })
}

export const getAllEventsOfDate = (date) => {
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
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

export const checkManifest = () => {
  const localData = storage.getRootStore()
  if (!localData) {
    return false
  }

  const domainName = getDomain()
  return localData[domainName] && localData[domainName].manifest.createdDate != null
}

export const pullManifest = () => {
  return new Promise((resolve, reject) => {
    const url = `${getUrl()}/${manifestConst.MANIFEST_PATH}`
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain()
    })
    postRequest(url, payload)
      .then((data) => {
        setManifestData(data)
        setManifestRefreshInterval()
        setSyncEventsInterval()
        syncRetentionData()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getManifestVariable = (name) => {
  const manifestStore = storage.getManifestStore()
  if (!manifestStore || manifestStore.manifestData == null) {
    return null
  }

  const manifestData = removeEmptyValue(manifestStore.manifestData.variables)
  const intervalIndex = manifestData.findIndex((obj) => obj.variableName === name)
  if (intervalIndex === -1) {
    return null
  }

  return manifestData[intervalIndex].value
}

export const updateManifest = () => {
  pullManifest()
    .then((data) => {
      storage.setManifestModifiedDate(Date.now())
      storage.setManifestDataStore(data)
      storage.updateStore()
      setManifestRefreshInterval()
      setSyncEventsInterval()
      syncRetentionData()
    })
    .catch((error) => {
      log.error(error)
    })
}

export const checkUpdateForManifest = () => {
  const modifiedDate = storage.getManifestModifiedDate()
  const diffTime = millisecondsToHours(Date.now() - modifiedDate)
  let manifestRefData = getManifestVariable(constants.MANIFEST_REFRESH_INTERVAL)
  manifestRefData = manifestRefData || callInterval
  if (diffTime >= manifestRefData) {
    return true
  }

  const callTime = manifestRefData - diffTime
  setTimeout(() => {
    pullManifest()
      .then((data) => {
        storage.setManifestModifiedDate(Date.now())
        storage.setManifestDataStore(data)
        storage.updateStore()
      })
      .catch((error) => {
        log.error(error)
      })
  }, callTime)
  return false
}

export const initialize = (isDecryptionError) => {
  const localData = isDecryptionError ? null : storage.getRootStore()
  const hostname = getDomain()
  const date = getDate()
  const sessionId = checkAndGetSessionId()

  if (storage.getLocalData(getRootKey())) {
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
          syncPreviousSessionEvents()
        }

        if (!localData[hostname].events[date].sdkData.sessions[sessionId]) {
          const session = createSessionObject(constants.INIT, constants.INIT)
          localData[hostname].events[date].sdkData.sessions[sessionId] = Object.assign(session)
        }
      } else {
        localData[hostname] = createDomain(constants.INIT)
      }
    }
    storage.setRootStore(localData)
    setUID()
    storage.updateStore()
    return
  }

  const domainSchema = createDomain(constants.INIT)
  const obj = {
    domains: [hostname],
    [hostname]: domainSchema
  }
  storage.setRootStore(obj)
  setUIDInInitEvent()
  setUID()
  storage.updateStore()
}

export const checkGeo = () => {
  const eventStore = storage.getEventsStore()
  const date = getDate()
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)

  return !!(sessionId &&
    eventStore[date].sdkData.sessions[sessionId] &&
    eventStore[date].sdkData.sessions[sessionId].geo &&
    eventStore[date].sdkData.sessions[sessionId].geo.conc &&
    mode === constants.PRIVACY_MODE)
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
  storage.setEventsStore(eventStore)
  storage.updateStore()
}

export const setRetentionData = () => {
  const mode = getManifestVariable(constants.MODE_DEPLOYMENT)
  if (!mode || mode === constants.FIRSTPARTY_MODE) {
    return
  }
  retention.setDAU()
  retention.setWAU()
  retention.setMAU()
  retention.setDAST()
  retention.setWAST()
  retention.setMAST()

  const isPayingUser = storage.getLocalData(constants.IS_PAYING_USER)
  if (isPayingUser) {
    retention.setDPU()
    retention.setWPU()
    retention.setMPU()
  }
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
  const sysEvents = sysMergeCounterValue ? chunk(events, sysMergeCounterValue) : []
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

export const checkEventPushEventCounter = (eventsDataObj) => {
  const eventsCount = getNotSyncedEventsCount(eventsDataObj)
  let eventsPushEventsCounter = getManifestVariable(constants.EVENT_PUSH_EVENTSCOUNTER)
  if (eventsPushEventsCounter == null) {
    eventsPushEventsCounter = constants.DEFAULT_EVENT_PUSH_EVENTSCOUNTER
  }

  return eventsCount >= parseInt(eventsPushEventsCounter)
}

export const syncEvents = () => {
  if (!isSysEvtStore && !isDevEvtStore) {
    return
  }

  setSyncEventsInterval()
  const date = getDate()
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
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
    const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
    postRequest(url, JSON.stringify(payload))
      .then(() => {
        setEventsSentToServer(arr, date, sessionId)
      })
      .catch(log.error)
  })
}

export const sendBounceEvent = (date) => {
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const events = getBounceAndSessionEvents(sdkDataForDate)
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const payload = getPayload(sdkDataForDate.sessions[sessionId], eventsArr)

  const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(log.error)
}

export const sendNavigation = (date, sessionId) => {
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const referrer = getReferrerUrlOfDateSession(date, sessionId)
  const navigations = sdkDataForDate.sessions[sessionId].eventsData.navigationPath.slice()
  const navigationsTime = sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav.slice()
  if (navigations.length === 0 || navigations.length !== navigationsTime.length) {
    return
  }
  if (referrer != null) {
    navigations.unshift(referrer)
    navigationsTime.unshift(0)
  }

  const navEventArr = getNavigationPayloadArr(navigations, navigationsTime)
  const payload = getPayload(sdkDataForDate.sessions[sessionId], navEventArr)
  const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
  postRequest(url, JSON.stringify(payload))
    .then(() => { })
    .catch(log.error)
}

export const getBounceAndSessionEvents = (obj) => {
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  return obj.sessions[sessionId].eventsData.eventsInfo
    .filter((evt) => evt.name === constants.BOUNCE || constants.SESSION)
}

export const detectQueryString = () => {
  const currentUrl = window.location.href
  return (/\?.+=.*/g).test(currentUrl)
}

export const getReferrerUrlOfDateSession = (date, sessionId) => {
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo
    .findIndex((obj) => obj.name === 'referrer')

  if (refIndex === -1) {
    return null
  }

  return sdkDataForDate.sessions[sessionId].eventsData.eventsInfo[refIndex].value
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

  if (event.srcElement && event.srcElement.localName) {
    const elmIndex = elmArr.findIndex((el) => el === event.srcElement.localName)
    if (elmIndex !== -1) {
      return event.target.innerText
    }

    if (event.srcElement.firstElementChild && event.srcElement.firstElementChild.localName !== 'head') {
      return event.srcElement.firstElementChild.innerText
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
  if (events && events.length < 1) {
    return
  }

  const key = type === 'pii' ? constants.PII_PUBLIC_KEY : constants.PHI_PUBLIC_KEY
  const sessionId = storage.getSessionData(constants.SESSION_ID)
  const sdkDataForDate = storage.getEventsSDKDataForDate(date)
  const eventsArr = getEventPayloadArr(events, date, sessionId)
  const publicKey = getManifestVariable(key)
  const obj = encryptRSA(publicKey, JSON.stringify(eventsArr))

  const payload = getPayload(sdkDataForDate.sessions[sessionId])

  if (type === 'pii') {
    payload.pii = obj
  } else {
    payload.phi = obj
  }

  const url = getManifestUrl(constants.EVENT_PATH, manifestConst.Event_Path)
  postRequest(url, JSON.stringify(payload))
    .then(() => {
      setEventsSentToServer(events, date, sessionId)
    })
    .catch(log.error)
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

export const getPreviousDateSessionEventData = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = storage.getEventsSDKDataForDate(notSyncDate)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)
  return sdkDataForDate.sessions[sessionId].eventsData
}

export const resetPreviousDateSessionNavigation = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = storage.getEventsSDKDataForDate(notSyncDate)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)
  sdkDataForDate.sessions[sessionId].eventsData.navigationPath = []
  sdkDataForDate.sessions[sessionId].eventsData.stayTimeBeforeNav = []
}

export const getPreviousDateReferrer = () => {
  const notSyncDate = getNotSyncedDate()
  const sdkDataForDate = storage.getEventsSDKDataForDate(notSyncDate)
  const sessionId = getNotSyncedSession(sdkDataForDate.sessions)

  const refIndex = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo.findIndex((obj) => obj.name === 'referrer')
  if (refIndex !== -1) {
    const referrer = sdkDataForDate.sessions[sessionId].eventsData.eventsInfo[refIndex]
    referrer.sentToServer = true
    return referrer
  }

  return null
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

  let sysMergeCounterValue = 0
  if (sysMergeCounter === '-1') {
    sysMergeCounterValue = events.length
  } else if (sysMergeCounter > 0) {
    sysMergeCounterValue = sysMergeCounter
  }
  return sysMergeCounterValue
}