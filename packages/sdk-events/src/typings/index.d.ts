import { EventOptions, EventData } from '@blotoutio/sdk-core'

type EventType = 'mapID' | 'transaction'

interface Field {
  required: boolean
  key: string
}

interface Event<T> {
  name: string
  code: number
  fields: Record<keyof T, Field>
}

interface MapIDData {
  externalID: string
  provider: string
}

interface TransactionData {
  ID: string
  currency?: string
  payment?: string
  total?: number
  discount?: number
  shipping?: number
  tax?: number
}

export declare const mapID: (
  mapIDData: MapIDData,
  additionalData?: EventData,
  options?: EventOptions
) => void

export declare const transaction: (
  transactionData: TransactionData,
  additionalData?: EventData,
  options?: EventOptions
) => void
