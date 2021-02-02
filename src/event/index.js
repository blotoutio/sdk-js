import { getSelector, sendEvent } from './utils'
import { constants, highFreqEvents, isHighFreqEventOff } from '../common/config'
import { error } from '../common/logUtil'
import { createDevEvent, createEvent } from './create'
/// #if FEATURES == 'full'
import { handlePersonalEvent } from '../personal'
/// #endif

export const mapID = (id, provider, data) => {
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

  setDevEvent([
    {
      name: constants.MAP_ID_EVENT,
      code: constants.MAP_ID_EVENT_CODE,
      data: {
        ...data,
        map_id: id,
        map_provider: provider,
      },
    },
  ])
}

export const setStartEvent = () => {
  setEvent('sdk_start')
}

export const setEvent = function (name, event, options = null) {
  if (!name || (isHighFreqEventOff && highFreqEvents.includes(name))) {
    return
  }

  const objectName = event && getSelector(event.target)
  sendEvent(
    [
      {
        data: createEvent(name, objectName, event),
      },
    ],
    options
  )
}

export const setDevEvent = (events, options = null) => {
  const devEvents = []
  events.forEach((event) => {
    let data

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

  sendEvent(devEvents, options)
}
