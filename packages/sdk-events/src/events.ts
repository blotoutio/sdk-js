import {
  EventOptions,
  EventData,
  internalUtils,
  SendEvent,
} from '@blotoutio/sdk-core'
import { constants } from './constants'
import { Event, EventType, Field } from './typings'

const getType = (type: EventType): unknown => {
  switch (type) {
    case 'mapID': {
      return {
        name: constants.MAP_ID_NAME,
        code: constants.MAP_ID_CODE,
        fields: {
          externalID: {
            required: true,
            key: 'map_id',
          },
          provider: {
            required: true,
            key: 'map_provider',
          },
        },
      }
    }
    case 'transaction': {
      return {
        name: constants.TRANSACTION_NAME,
        code: constants.TRANSACTION_CODE,
        fields: {
          ID: {
            required: true,
            key: 'transaction_id',
          },
          currency: {
            required: false,
            key: 'transaction_currency',
          },
          payment: {
            required: false,
            key: 'transaction_payment',
          },
          total: {
            required: false,
            key: 'transaction_total',
          },
          discount: {
            required: false,
            key: 'transaction_discount',
          },
          shipping: {
            required: false,
            key: 'transaction_shipping',
          },
          tax: {
            required: false,
            key: 'transaction_tax',
          },
        },
      }
    }
  }
}

const generateEvent = (
  name: string,
  code: number,
  eventData: EventData,
  additionalData: EventData = {}
): SendEvent => {
  const data = internalUtils.createBasicEvent({
    name,
    code,
  })

  return {
    type: 'codified',
    data,
    extra: {
      ...additionalData,
      ...eventData,
    },
  }
}

const validateInput = <T>(
  input: T,
  event: Event<T>
): null | Record<string, unknown> => {
  if (!input) {
    internalUtils.error(`Data not provided for ${event.name}`)
    return
  }

  const data: Record<string, unknown> = {}
  let error = false
  Object.entries(event.fields).forEach(([keyString, fieldObject]) => {
    const key = keyString as keyof T
    const field = fieldObject as Field
    if (!input[key]) {
      if (field.required) {
        error = true
        internalUtils.error(`Missing required field ${key} for ${event.name}`)
      }
      return
    }

    data[field.key] = input[key]
  })

  if (error) {
    return null
  }

  return data
}

export const createEvent = <T>(
  type: EventType,
  inputData: T,
  additionalData?: EventData,
  options?: EventOptions
): void => {
  const event = getType(type) as Event<T>
  const eventData = validateInput<T>(inputData, event)
  if (!eventData) {
    return
  }

  const finalEvent = generateEvent(
    event.name,
    event.code,
    eventData,
    additionalData
  )

  internalUtils.sendEvent([finalEvent], options)
}
