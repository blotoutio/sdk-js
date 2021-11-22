import { getSession } from '../storage'
import { getSessionDataKey } from '../storage/key'
import { info } from '../common/logUtil'
import type { EventPayload } from '../typings'
import { getCreateTimestamp } from '../common/utils'

const getMeta = () => {
  let ua = navigator.userAgent
  ua = navigator.brave ? `${ua} Brave` : ua

  let sessionData: SessionData
  try {
    sessionData = JSON.parse(getSession(getSessionDataKey()))
  } catch (e) {
    info(e)
  }

  const meta: Meta = {
    sdkv: process.env.PACKAGE_VERSION,
    tz_offset: new Date().getTimezoneOffset() * -1,
    user_agent: ua,
    page_title: document.title,
  }

  const createdUser = getCreateTimestamp()
  if (createdUser) {
    meta.user_id_created = createdUser
  }

  if (sessionData) {
    if (sessionData.referrer) {
      meta.referrer = sessionData.referrer
    }

    if (sessionData.search) {
      meta.search = sessionData.search
    }
  }

  return meta
}

export const getPayload = (events?: EventPayload[]): Payload => {
  const payload: Payload = {
    meta: getMeta(),
  }

  if (events) {
    payload.events = events
  }

  return payload
}
