import { EventOptions, EventData } from '@blotoutio/sdk-core'

type EventType = 'mapID' | 'transaction' | 'item' | 'persona'

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

interface ItemData {
  ID: string
  name?: string
  SKU?: string
  category?: string[]
  price?: number
  currency?: string
  quantity?: number
}

interface PersonaData {
  ID: string
  firstname?: string
  lastname?: string
  middlename?: string
  username?: string
  dob?: string
  email?: string
  number?: string
  address?: string
  city?: string
  state?: string
  zip?: number
  country?: string
  gender?: string
  age?: number
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

export declare const item: (
  itemData: ItemData,
  additionalData?: EventData,
  options?: EventOptions
) => void

export declare const persona: (
  personaData: PersonaData,
  additionalData?: EventData,
  options?: EventOptions
) => void
