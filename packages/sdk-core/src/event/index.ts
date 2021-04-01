import { getObjectTitle, getSelector, sendEvent } from './utils'
import {
  constants,
  highFreqEvents,
  isHighFreqEventOff,
  systemEventCode,
} from '../common/config'
import { error } from '../common/logUtil'
import { createBasicEvent, createPosition } from './create'
import type {
  EventData,
  EventOptions,
  IncomingEvent,
  SendEvent,
} from '../typings'

export const sendSystemEvent = (
  name: string,
  event?: Event,
  options?: EventOptions
): void => {
  if (!name || (isHighFreqEventOff && highFreqEvents.includes(name))) {
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

    eventObject.extra.objectName = getSelector(event.target as HTMLElement)
  }

  sendEvent([eventObject], options)
}

export const sendDevEvent = (
  events: IncomingEvent[],
  options?: EventOptions
): void => {
  if (!events) {
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

export const pageView = (previousUrl: string): void => {
  const visibilityHidden: SendEvent = {
    type: 'system',
    data: createBasicEvent({
      name: constants.VISIBILITY_HIDDEN,
      url: previousUrl,
      code: systemEventCode.visibilityHidden,
    }),
  }

  const sdkStart: SendEvent = {
    type: 'system',
    data: createBasicEvent({
      name: constants.SDK_START,
      code: systemEventCode.sdk_start,
    }),
  }

  sendEvent([visibilityHidden, sdkStart])
}
