import * as eventUtils from './utils'
import * as storage from '../storage'
import { mapID, pageView, setDevEvent, setEvent, setStartEvent } from './index'
import type { EventOptions, SendEvent } from '../typings'

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

  it('id is empty', () => {
    mapID('', '')
    expect(spySet).toBeCalledTimes(0)
  })

  it('provider is empty', () => {
    mapID('sdfasfasdfds', '')
    expect(spySet).toBeCalledTimes(0)
  })

  it('data is not set', () => {
    mapID('sdfasfasdfds', 'service')
    expect(spySet).toBeCalledWith(
      [
        {
          data: {
            evcs: 21001,
            metaInfo: { map_id: 'sdfasfasdfds', map_provider: 'service' },
            mid: 'localhost-null-1580775120000',
            name: 'map_id',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })

  it('with data', () => {
    mapID('sdfasfasdfds', 'service', { custom: true })
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
      undefined
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
      undefined
    )
    spySend.mockRestore()
  })
})

describe('setEvent', () => {
  let spySend: jest.SpyInstance<void, [SendEvent[], EventOptions?]>

  beforeEach(() => {
    spySend = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
  })

  afterEach(() => {
    spySend.mockReset()
  })

  afterAll(() => {
    spySend.mockRestore()
  })

  it('empty name', () => {
    setEvent('')
    expect(spySend).toBeCalledTimes(0)
  })

  it('high frequency event', () => {
    setEvent('focus')
    expect(spySend).toBeCalledTimes(0)
  })

  it('ok', () => {
    const target = document.createElement('h1')
    target.innerText = 'hi'

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })
    setEvent('click', event, { method: 'beacon' })
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 11119,
            mid: 'localhost-null-1580775120000',
            mouse: { x: -1, y: -1 },
            name: 'click',
            objectName: 'H1',
            objectTitle: 'hi',
            position: { height: -1, width: -1, x: -1, y: -1 },
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      { method: 'beacon' }
    )
  })
})

describe('setDevEvent', () => {
  let spySend: jest.SpyInstance<void, [SendEvent[], EventOptions?]>

  beforeEach(() => {
    spySend = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
  })

  afterEach(() => {
    spySend.mockReset()
  })

  afterAll(() => {
    spySend.mockRestore()
  })

  it('null', () => {
    setDevEvent(null)
    expect(spySend).toBeCalledTimes(0)
  })

  it('empty events', () => {
    setDevEvent([])
    expect(spySend).toBeCalledTimes(0)
  })

  it('ok', () => {
    setDevEvent([
      {
        name: 'custom-event',
        data: {
          foo: true,
        },
      },
      {
        name: '',
        data: {
          foo: true,
        },
      },
      {
        name: 'new-event',
        data: null,
        options: {
          method: 'beacon',
        },
      },
    ])
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 23872,
            metaInfo: { foo: true },
            mid: 'localhost-null-1580775120000',
            name: 'custom-event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
        {
          data: {
            evcs: 24004,
            mid: 'localhost-null-1580775120000',
            name: 'new-event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })
})

describe('pageView', () => {
  it('ok', () => {
    const spySend = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
    pageView('https://blotout.io/')
    expect(spySend).toBeCalledWith([
      {
        data: {
          evcs: 11106,
          mid: 'localhost-null-1580775120000',
          name: 'pagehide',
          tstmp: 1580775120000,
          urlPath: 'https://blotout.io/',
        },
      },
      {
        data: {
          evcs: 11130,
          mid: 'localhost-null-1580775120000',
          name: 'sdk_start',
          tstmp: 1580775120000,
          urlPath: 'http://localhost/',
        },
      },
    ])
    spySend.mockRestore()
  })
})
