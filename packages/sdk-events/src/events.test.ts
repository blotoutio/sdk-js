import { createEvent } from './events'
import {
  BasicEvent,
  EventOptions,
  IncomingEvent,
  internalUtils,
  SendEvent,
} from '@blotoutio/sdk-core'

describe('createEvent', () => {
  let spySet: jest.SpyInstance<
    void,
    [events: SendEvent[], options?: EventOptions]
  >
  let spyCreate: jest.SpyInstance<BasicEvent, [event: IncomingEvent]>

  beforeEach(() => {
    spySet = jest.spyOn(internalUtils, 'sendEvent').mockImplementation()
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
    spyCreate = jest
      .spyOn(internalUtils, 'createBasicEvent')
      .mockImplementation(() => ({
        evcs: 21001,
        mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
        name: 'map_id',
        tstmp: 1580775120000,
        urlPath: 'http://localhost/',
      }))
  })

  afterEach(() => {
    spySet.mockRestore()
    spyCreate.mockRestore()
  })

  it('empty', () => {
    createEvent('mapID', null)
    expect(spySet).toBeCalledTimes(0)
  })

  it('validate required failed', () => {
    createEvent('mapID', { externalID: null, provider: 'service' })
    expect(spySet).toBeCalledTimes(0)
  })

  it('basic event', () => {
    createEvent('mapID', {
      externalID: 'sdfasfasdfds',
      provider: 'service',
    })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            evcs: 21001,
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
  })

  it('basic event with random data added', () => {
    createEvent('mapID', {
      externalID: 'sdfasfasdfds',
      provider: 'service',
      test: true,
    })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            evcs: 21001,
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
  })

  it('with additional data', () => {
    createEvent(
      'mapID',
      { externalID: 'sdfasfasdfds', provider: 'service' },
      { custom: true }
    )
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            evcs: 21001,
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'map_id',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            custom: true,
            map_id: 'sdfasfasdfds',
            map_provider: 'service',
          },
        },
      ],
      undefined
    )
  })
})
