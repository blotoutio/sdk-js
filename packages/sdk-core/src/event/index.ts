import { getSelector, sendEvent } from './utils'
import {
  constants,
  highFreqEvents,
  isHighFreqEventOff,
  systemEventCode,
} from '../common/config'
import { error } from '../common/logUtil'
import { createEvent } from './create'
import type {
  EventData,
  EventOptions,
  IncomingEvent,
  SendEvent,
} from '../typings'

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

  setDevEvent(
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

export const setStartEvent = (): void => {
  setEvent(constants.SDK_START)
}

export const setEvent = (
  name: string,
  event?: Event,
  options?: EventOptions
): void => {
  if (!name || (isHighFreqEventOff && highFreqEvents.includes(name))) {
    return
  }

  const objectName = event && getSelector(event.target as HTMLElement)
  sendEvent(
    [
      {
        data: createEvent({
          name,
          objectName,
          code: systemEventCode[name],
          event: event as MouseEvent,
        }),
      },
    ],
    options
  )
}

export const setDevEvent = (
  events: IncomingEvent[],
  options?: EventOptions
): void => {
  if (!events) {
    return
  }

  const devEvents: SendEvent[] = []
  events.forEach((event) => {
    const dev = createEvent(event)
    if (!dev) {
      return
    }

    devEvents.push({
      data: dev,
    })
  })

  if (devEvents.length === 0) {
    return
  }

  sendEvent(devEvents, options)
}

export const pageView = (previousUrl: string): void => {
  const pagehide = {
    data: createEvent({
      name: constants.PAGE_HIDE,
      url: previousUrl,
      code: systemEventCode.pagehide,
    }),
  }

  const sdkStart = {
    data: createEvent({
      name: constants.SDK_START,
      code: systemEventCode.sdk_start,
    }),
  }

  sendEvent([pagehide, sdkStart])
}
