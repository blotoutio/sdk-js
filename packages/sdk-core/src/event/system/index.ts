import { pagehide, visibilityChange } from './visibility'
import { online, offline } from './network'
import { sendSystemEvent } from '../index'
import { getVariable } from '../../common/manifest'
import { systemEvents } from './events'

export const optionalEvents = (): void => {
  const manifestEvents = getVariable('systemEvents') as string[]
  if (!manifestEvents) {
    return
  }

  manifestEvents.forEach((eventCode) => {
    const systemEvent = systemEvents[eventCode]
    if (!systemEvent) {
      return
    }

    if (systemEvent.operation) {
      systemEvent.operation()
      return
    }

    window.addEventListener(systemEvent.name, (event) => {
      sendSystemEvent(systemEvent.name, event)
    })
  })
}

export const requiredEvents = (): void => {
  pagehide()
  visibilityChange()
  online()
  offline()
}
