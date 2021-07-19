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
    case 'item': {
      return {
        name: constants.ITEM_NAME,
        code: constants.ITEM_CODE,
        fields: {
          ID: {
            required: true,
            key: 'item_id',
          },
          name: {
            required: false,
            key: 'item_name',
          },
          SKU: {
            required: false,
            key: 'item_sku',
          },
          category: {
            required: false,
            key: 'item_category',
          },
          price: {
            required: false,
            key: 'item_price',
          },
          currency: {
            required: false,
            key: 'item_currency',
          },
          quantity: {
            required: false,
            key: 'item_quantity',
          },
        },
      }
    }
    case 'persona': {
      return {
        name: constants.PERSONA_NAME,
        code: constants.PERSONA_CODE,
        fields: {
          ID: {
            required: true,
            key: 'persona_id',
          },
          firstname: {
            required: false,
            key: 'persona_firstname',
          },
          lastname: {
            required: false,
            key: 'persona_lastname',
          },
          middlename: {
            required: false,
            key: 'persona_middlename',
          },
          username: {
            required: false,
            key: 'persona_username',
          },
          dob: {
            required: false,
            key: 'persona_dob',
          },
          email: {
            required: false,
            key: 'persona_email',
          },
          number: {
            required: false,
            key: 'persona_number',
          },
          address: {
            required: false,
            key: 'persona_address',
          },
          city: {
            required: false,
            key: 'persona_city',
          },
          state: {
            required: false,
            key: 'persona_state',
          },
          zip: {
            required: false,
            key: 'persona_zip',
          },
          country: {
            required: false,
            key: 'persona_country',
          },
          gender: {
            required: false,
            key: 'persona_gender',
          },
          age: {
            required: false,
            key: 'persona_age',
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
