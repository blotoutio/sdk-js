import * as eventUtils from './utils'
import * as storage from '../storage'
import {
  mapID,
  pageView,
  sendDevEvent,
  sendSystemEvent,
  setDefaultEventData,
} from './index'
import type { EventOptions, SendEvent } from '../typings'
import { setEnable, setInitialised } from '../common/enabled'
import { getSessionDataKey } from '../storage/key'

jest.mock('uuid', () => ({ v4: () => '43cf2386-1285-445c-8633-d7555d6e2f35' }))

window.fetch = require('node-fetch')
beforeAll(() => {
  jest.spyOn(window, 'fetch')
  setInitialised()
})

let spySession: jest.SpyInstance<string, [name: string]>
beforeEach(() => {
  spySession = jest.spyOn(storage, 'getSession').mockImplementation((key) => {
    if (key === getSessionDataKey()) {
      return '{}'
    }
    return '124123423'
  })

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
  setEnable(true)
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

  it('SDK is disabled', () => {
    setEnable(false)
    mapID('sdfasfasdfds', 'service')
    expect(spySet).toBeCalledTimes(0)
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

  it('with data', () => {
    mapID('sdfasfasdfds', 'service', { custom: true })
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

describe('sendSystemEvent', () => {
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

  it('SDK is disabled', () => {
    setEnable(false)
    const target = document.createElement('h1')
    target.innerText = 'hi'

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })
    sendSystemEvent('click', event, { method: 'beacon' })
    expect(spySend).toBeCalledTimes(0)
  })

  it('empty name', () => {
    sendSystemEvent('')
    expect(spySend).toBeCalledTimes(0)
  })

  it('no event', () => {
    sendSystemEvent('click')
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11119,
            mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'click',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })

  it('ok', () => {
    const target = document.createElement('h1')
    target.innerText = 'hi'

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })
    sendSystemEvent('click', event, { method: 'beacon' })
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11119,
            mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'click',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            mouse: { x: -1, y: -1 },
            objectName: 'H1',
            objectTitle: 'hi',
            position: { height: -1, width: -1, x: -1, y: -1 },
          },
        },
      ],
      { method: 'beacon' }
    )
  })

  it('click with h1', () => {
    const target = document.createElement('h1')
    target.innerText = 'hi'

    const event = new MouseEvent('click', {
      screenX: 10,
      screenY: 20,
    })
    Object.defineProperty(event, 'target', {
      value: target,
    })

    sendSystemEvent('click', event)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11119,
            mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'click',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            mouse: {
              x: -1,
              y: -1,
            },
            objectName: 'H1',
            objectTitle: 'hi',
            position: { height: -1, width: -1, x: -1, y: -1 },
          },
        },
      ],
      undefined
    )
  })

  it('click with div', () => {
    const target = document.createElement('div')
    target.innerText = 'no'

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })

    sendSystemEvent('click', event)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11119,
            mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'click',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            mouse: {
              x: -1,
              y: -1,
            },
            objectName: 'DIV',
            objectTitle: 'no',
            position: { height: -1, width: -1, x: -1, y: -1 },
          },
        },
      ],
      undefined
    )
  })

  it('copy', () => {
    const event = new MouseEvent('copy', {
      screenX: 10,
      screenY: 20,
    })

    Object.defineProperty(event, 'target', {
      value: null,
    })

    sendSystemEvent('copy', event)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11102,
            mid: 'Y29weQ==-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'copy',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: {
            mouse: { x: -1, y: -1 },
            position: { height: -1, width: -1, x: -1, y: -1 },
          },
        },
      ],
      undefined
    )
  })

  it('sdk_start', () => {
    sendSystemEvent('sdk_start')
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11130,
            mid:
              'c2RrX3N0YXJ0-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'sdk_start',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })

  it('visibility_hidden', () => {
    sendSystemEvent('visibility_hidden')
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11132,
            mid:
              'dmlzaWJpbGl0eV9oaWRkZW4=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'visibility_hidden',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })

  it('visibility_visible', () => {
    sendSystemEvent('visibility_visible')
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'system',
          data: {
            evcs: 11131,
            mid:
              'dmlzaWJpbGl0eV92aXNpYmxl-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'visibility_visible',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
        },
      ],
      undefined
    )
  })
})

describe('sendDevEvent', () => {
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
    sendDevEvent(null)
    expect(spySend).toBeCalledTimes(0)
  })

  it('empty events', () => {
    sendDevEvent([])
    expect(spySend).toBeCalledTimes(0)
  })

  it('SDK disabled', () => {
    setEnable(false)
    sendDevEvent([
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
    expect(spySend).toBeCalledTimes(0)
  })

  it('ok', () => {
    setInitialised()
    sendDevEvent([
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
            mid:
              'Y3VzdG9tLWV2ZW50-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'custom-event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { foo: true },
          type: 'codified',
        },
        {
          data: {
            evcs: 24004,
            mid:
              'bmV3LWV2ZW50-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'new-event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: null,
          type: 'codified',
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
        type: 'system',
        data: {
          evcs: 11132,
          mid:
            'dmlzaWJpbGl0eV9oaWRkZW4=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
          name: 'visibility_hidden',
          tstmp: 1580775120000,
          urlPath: 'https://blotout.io/',
        },
      },
      {
        type: 'system',
        data: {
          evcs: 11130,
          mid:
            'c2RrX3N0YXJ0-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
          name: 'sdk_start',
          tstmp: 1580775120000,
          urlPath: 'http://localhost/',
        },
      },
    ])
    spySend.mockRestore()
  })
})

describe('setDefaultEventData', () => {
  const data = { data: true }
  let spySet: jest.SpyInstance<void, [key: keyof SessionData, value: unknown]>
  beforeEach(() => {
    spySet = jest.spyOn(storage, 'setSessionDataValue').mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('null data', () => {
    setDefaultEventData([], null)
    expect(spySet).toBeCalledTimes(0)
  })

  it('null key', () => {
    setDefaultEventData([null], data)
    expect(spySet).toBeCalledTimes(0)
  })

  it('all', () => {
    setDefaultEventData([], data)
    expect(spySet).toBeCalledWith('dataAll', data)
  })

  it('multiple', () => {
    setDefaultEventData(['codified', 'system'], data)
    expect(spySet).toBeCalledWith('dataCodified', data)
    expect(spySet).toBeCalledWith('dataSystem', data)
  })
})
