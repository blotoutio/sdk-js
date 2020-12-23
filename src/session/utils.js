import { getSession, setSession } from '../storage'
import { constants } from '../config'
import { getManifestVariable } from '../manifest'
import { createEventInfoObj } from '../event/session'
import { getOS } from '../common/operatingSystemUtil'
import { eventSync } from '../event/utils'
import { syncEvents } from '../event'
import { getDomain } from '../common/domainUtil'

const findOS = () => {
  let curOS = ''
  if (navigator.appVersion.indexOf('Win') !== -1) curOS = 'Windows'
  if (navigator.appVersion.indexOf('Mac') !== -1) curOS = 'MacOS'
  if (navigator.appVersion.indexOf('X11') !== -1) curOS = 'UNIX'
  if (navigator.appVersion.indexOf('Linux') !== -1) curOS = 'Linux'
  return curOS
}

const browserVersion = (userAgent, regex) => {
  return userAgent.match(regex) ? userAgent.match(regex)[2] : null
}

const getBrowser = (userAgent) => {
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

const getDeviceType = () => {
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

const getNotSyncedEventsCount = (obj) => {
  if (!obj || !obj.eventsInfo || !obj.devCodifiedEventsInfo) {
    return 0
  }
  let events = obj.eventsInfo.filter((evt) => !evt.sentToServer)
  const devEvents = obj.devCodifiedEventsInfo.filter((evt) => !evt.sentToServer)
  events = events.concat(devEvents)
  return events.length
}

const checkEventPushEventCounter = (eventsData) => {
  const eventsCount = getNotSyncedEventsCount(eventsData)
  let manifestCounter = getManifestVariable(constants.EVENT_PUSH_EVENTSCOUNTER)
  if (manifestCounter == null) {
    manifestCounter = constants.DEFAULT_EVENT_PUSH_EVENTSCOUNTER
  }

  return eventsCount >= parseInt(manifestCounter)
}

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
    // To calculate navigation time
    setSession(constants.SESSION_START_TIME, sessionId)
  }

  return sessionId
}

export const getNotSynced = (sessions) => {
  let sessionId = null
  for (const id in sessions) {
    if (!sessions[id].eventsData) {
      continue
    }
    sessionId = id
    if (!sessions[id].eventsData.sentToServer) {
      break
    }
  }
  return sessionId
}

export const maybeSync = (eventsData) => {
  if (!eventsData) {
    return
  }
  const isEventPush = checkEventPushEventCounter(eventsData)
  if (isEventPush && !eventSync.progressStatus) {
    eventSync.progressStatus = true
    syncEvents()
  }
}

export const createSessionObject = (eventName, objectName) => {
  return {
    startTime: Date.now(),
    endTime: 0,
    lastServerSyncTime: 0,
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

export const createViewPortObject = () => {
  return {
    timeStamp: Date.now(),
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    docHeight: document.documentElement.scrollHeight,
    docWidth: document.documentElement.scrollWidth
  }
}
