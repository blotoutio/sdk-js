import { item, mapID, persona, transaction } from './index'
import * as core from '@blotoutio/sdk-core'

let spySet: jest.SpyInstance<
  void,
  [events: core.SendEvent[], options?: core.EventOptions]
>
let spyCreate: jest.SpyInstance<core.BasicEvent, [event: core.IncomingEvent]>

beforeEach(() => {
  spySet = jest.spyOn(core.internalUtils, 'sendEvent').mockImplementation()
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
  spyCreate = jest
    .spyOn(core.internalUtils, 'createBasicEvent')
    .mockImplementation((event) => ({
      mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: event.name,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    }))
})

afterEach(() => {
  spySet.mockRestore()
  spyCreate.mockRestore()
})

describe('mapID', () => {
  it('SDK is disabled', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => false)
    mapID({ externalID: 'sdfasfasdfds', provider: 'service' })
    expect(spySet).toBeCalledTimes(0)
    spyEnabled.mockReset()
  })

  it('ok', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => true)
    mapID({ externalID: 'sdfasfasdfds', provider: 'service' })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'map_id',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { map_id: 'sdfasfasdfds', map_provider: 'service' },
        },
      ],
      undefined
    )
    spyEnabled.mockReset()
  })
})

describe('transaction', () => {
  it('SDK is disabled', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => false)
    transaction({ ID: '123423423' })
    expect(spySet).toBeCalledTimes(0)
    spyEnabled.mockReset()
  })

  it('ok', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => true)
    transaction({ ID: '123423423', currency: 'EUR', total: 10.5 })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'transaction',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            transaction_id: '123423423',
            transaction_currency: 'EUR',
            transaction_total: 10.5,
          },
        },
      ],
      undefined
    )
    spyEnabled.mockReset()
  })
})

describe('item', () => {
  it('SDK is disabled', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => false)
    item({ ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 })
    expect(spySet).toBeCalledTimes(0)
    spyEnabled.mockReset()
  })

  it('ok', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => true)
    item({ ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'item',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            item_id: '123423423',
            item_currency: 'EUR',
            item_price: 10.5,
            item_quantity: 2,
          },
        },
      ],
      undefined
    )
    spyEnabled.mockReset()
  })
})

describe('persona', () => {
  it('SDK is disabled', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => false)
    persona({ ID: '3434343', gender: 'female', age: 22 })
    expect(spySet).toBeCalledTimes(0)
    spyEnabled.mockReset()
  })

  it('ok', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => true)
    persona({ ID: '3434343', gender: 'female', age: 22 })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'persona',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            persona_id: '3434343',
            persona_gender: 'female',
            persona_age: 22,
          },
        },
      ],
      undefined
    )
    spyEnabled.mockReset()
  })
})
