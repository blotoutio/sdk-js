import { createDevEventInfoObj } from '../event/utils'
import { sendPIIPHIEvent } from '../event'

export const setPersonalEvent = (eventName, data, isPII = false) => {
  if (!eventName) {
    return
  }
  const event = createDevEventInfoObj(eventName, null, data)
  sendPIIPHIEvent(event, isPII)
}
