import { getSession } from '../storage'
import { constants } from '../common/config'
import { getPreviousDateString, getStringDate } from '../common/timeUtil'
import { getSessionForDate, setSessionForDate } from '../event/session'

export const updatePreviousDayEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getPreviousDateString()
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  session.endTime = Date.now()
  setSessionForDate(date, sessionId, session)
}

export const updateEndTime = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  session.endTime = Date.now()
  setSessionForDate(date, sessionId, session)
}
