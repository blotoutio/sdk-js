import { createEvent } from './events'
import { EventData, EventOptions, isEnabled } from '@blotoutio/sdk-core'
import { ItemData, MapIDData, PersonaData, TransactionData } from './typings'

export const mapID = (
  mapIDData: MapIDData,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  createEvent<MapIDData>('mapID', mapIDData, data, options)
}

export const transaction = (
  transactionData: TransactionData,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  createEvent<TransactionData>('transaction', transactionData, data, options)
}

export const item = (
  itemData: ItemData,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  createEvent<ItemData>('item', itemData, data, options)
}

export const persona = (
  personaData: PersonaData,
  data?: EventData,
  options?: EventOptions
): void => {
  if (!isEnabled()) {
    return
  }

  createEvent<PersonaData>('persona', personaData, data, options)
}
