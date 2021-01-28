import { getSession } from '../storage'
import { constants } from '../common/config'
import { createViewPortObject } from './utils'
import { getSessionForDate, setSessionForDate } from '../event/session'
import { getStringDate } from '../common/timeUtil'

export const setViewPort = () => {
  const sessionId = getSession(constants.SESSION_ID)
  const date = getStringDate()
  const session = getSessionForDate(date, sessionId)
  if (!session) {
    return
  }

  if (!session.viewPort) {
    session.viewPort = []
  }
  const obj = createViewPortObject()
  session.viewPort.push(obj)
  setSessionForDate(date, sessionId, session)
}
