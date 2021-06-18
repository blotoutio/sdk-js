import { getObjectTitle, getSelector, sendEvent } from './utils'
import { constants, systemEventCode } from '../common/config'
import { error } from '../common/logUtil'
import { createBasicEvent, createPosition } from './create'
import type {
  EventData,
  EventOptions,
  EventType,
  IncomingEvent,
  SendEvent,
} from '../typings'
import { isEnabled } from '../common/enabled'
import { setSessionDataValue } from '../storage'
import { getSessionKeyForEventType } from '../storage/utils'

export const sendSystemEvent = (
  name: string,
  event?: Event,
  options?: EventOptions
): void => {
  if (!isEnabled() || !name) {
    return
  }

  const eventObject: SendEvent = {
    type: 'system',
    data: createBasicEvent({ name, code: systemEventCode[name] }),
  }

  if (event) {
    const mouseEvent = event as MouseEvent
    eventObject.extra = {
      position: createPosition(mouseEvent),
      mouse: {
        x: mouseEvent.clientX || -1,
        y: mouseEvent.clientY || -1,
      },
    }

    const title = getObjectTitle(event.target as HTMLElement)
    if (title) {
      eventObject.extra.objectTitle = title
    }

    const selector = getSelector(event.target as HTMLElement)
    if (selector) {
      eventObject.extra.objectName = selector
    }
  }

  sendEvent([eventObject], options)
}

export const sendDevEvent = (
  events: IncomingEvent[],
  options?: EventOptions
): void => {
  if (!isEnabled() || !events) {
    return
  }

  const devEvents: SendEvent[] = []
  events.forEach((event) => {
    const dev = createBasicEvent(event)
    if (!dev) {
      return
    }

    devEvents.push({
      type: 'codified',
      data: dev,
      extra: event.data,
    })
  })

  if (devEvents.length === 0) {
    return
  }

  sendEvent(devEvents, options)
}

export const mapID = (
  id: string,
  provider: string,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!id) {
    error('ID mapping is missing id')
    return
  }

  if (!provider) {
    error('ID mapping is missing provider')
    return
  }

  if (!data) {
    data = {}
  }

  sendDevEvent(
    [
      {
        name: constants.MAP_ID_EVENT,
        code: constants.MAP_ID_EVENT_CODE,
        data: {
          ...data,
          map_id: id,
          map_provider: provider,
        },
      },
    ],
    options
  )
}

export const pageView = (previousUrl: string, data?: EventData): void => {
  const visibilityHidden: SendEvent = {
    type: 'system',
    data: createBasicEvent({
      name: constants.VISIBILITY_HIDDEN,
      url: previousUrl,
      code: systemEventCode.visibility_hidden,
    }),
    extra: data,
  }

  const sdkStart: SendEvent = {
    type: 'system',
    data: createBasicEvent({
      name: constants.SDK_START,
      code: systemEventCode.sdk_start,
    }),
    extra: data,
  }

  sendEvent([visibilityHidden, sdkStart])
}

export const setDefaultEventData = (
  types: EventType[],
  data: EventData
): void => {
  if (!data) {
    return
  }

  if (types.length === 0) {
    setSessionDataValue('dataAll', data)
    return
  }

  for (const type of types) {
    const key = getSessionKeyForEventType(type)
    if (!key) {
      continue
    }
    setSessionDataValue(key, data)
  }
}
