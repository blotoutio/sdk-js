import { getSession, setSession } from '../storage'
import { constants } from '../common/config'

export const checkAndGetSessionId = () => {
  let sessionId = getSession(constants.SESSION_ID)

  if (!sessionId) {
    sessionId = Date.now()
    setSession(constants.SESSION_ID, sessionId)
  }

  return sessionId
}

export const createViewPortObject = () => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    docHeight: document.documentElement.scrollHeight,
    docWidth: document.documentElement.scrollWidth,
  }
}
