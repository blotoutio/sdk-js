import { createEvent } from './events'
import { EventData, EventOptions, isEnabled } from '@blotoutio/sdk-core'
import { MapIDData, TransactionData } from './typings'

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
