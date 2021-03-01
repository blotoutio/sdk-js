import { getSelector, sendEvent } from './utils'
import { constants, highFreqEvents, isHighFreqEventOff } from '../common/config'
import { error } from '../common/logUtil'
import { createDevEvent, createEvent } from './create'
/// #if FEATURES == 'full'
import { handlePersonalEvent } from '../personal'
/// #endif

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
        data: createEvent(name, objectName, event as MouseEvent),
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
    let data: SendEvent | null | false

    /// #if FEATURES == 'full'
    data = handlePersonalEvent(event)
    if (data === null) {
      return
    }
    /// #endif

    if (!data) {
      const dev = createDevEvent(event)
      if (!dev) {
        return
      }

      data = {
        data: dev,
      }
    }

    devEvents.push(data)
  })

  if (devEvents.length === 0) {
    return
  }

  sendEvent(devEvents, options)
}

export const pageView = (): void => {
  const sdkStart = {
    data: createEvent(constants.SDK_START),
  }
  const pagehide = {
    data: createEvent(constants.PAGE_HIDE),
  }

  sendEvent([pagehide, sdkStart])
}
