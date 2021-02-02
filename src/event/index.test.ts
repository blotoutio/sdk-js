import * as eventUtils from './utils'
import * as storage from '../storage'
import { mapID, setStartEvent } from '.'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

let spySession: jest.SpyInstance<string, [name: string]>
beforeEach(() => {
  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation(() => '124123423')

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('mapID', () => {
  let spySet: jest.SpyInstance<
    void,
    [events: SendEvent[], options?: EventOptions]
  >
  beforeEach(() => {
    spySet = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('with data', () => {
    mapID('sdfasfasdfds', 'service', { custom: true }, {})
    expect(spySet).toBeCalledWith(
      [
        {
          data: {
            evcs: 21001,
            metaInfo: {
              custom: true,
              map_id: 'sdfasfasdfds',
              map_provider: 'service',
            },
            mid: 'localhost-null-1580775120000',
            name: 'map_id',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      {}
    )
  })
})

describe('setStartEvent', () => {
  it('ok', () => {
    const spySend = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
    setStartEvent()
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 11130,
            mid: 'localhost-null-1580775120000',
            name: 'sdk_start',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      null
    )
    spySend.mockRestore()
  })
})
