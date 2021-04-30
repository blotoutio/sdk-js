import {
  codeForDevEvent,
  getObjectTitle,
  getSelector,
  sendEvent,
} from './utils'
import * as network from '../network'
import * as endPoint from '../network/endPoint'
import type { EventOptions } from '../typings'
import { setDefaultEventData } from './index'
import { getSessionID, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('codeForDevEvent', () => {
  it('empty', () => {
    expect(codeForDevEvent('')).toBe(0)
  })
  it('name has spaces', () => {
    expect(codeForDevEvent('some awesome event')).toBe(24016)
  })

  it('name with underscore', () => {
    expect(codeForDevEvent('awesome_event')).toBe(24008)
  })

  it('non ascii name', () => {
    expect(codeForDevEvent('目_awesome_event')).toBe(24049)
  })

  it('long name', () => {
    expect(
      codeForDevEvent(
        'event event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_event'
      )
    ).toBe(23962)
  })
})

describe('sendEvent', () => {
  let spy: jest.SpyInstance<Promise<unknown>, [string, string, EventOptions?]>
  let spyUrl: jest.SpyInstance<string, []>

  beforeEach(() => {
    spy = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())

    spyUrl = jest
      .spyOn(endPoint, 'getPublishUrl')
      .mockImplementation(() => 'https://domain.com/v1/publish')
  })

  afterEach(() => {
    spy.mockReset()
    spyUrl.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
    spyUrl.mockRestore()
  })

  it('empty events', () => {
    sendEvent([])
    expect(spy).toBeCalledTimes(0)
  })

  it('with events', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
    })
    setLocal(getUIDKey(), 'key')
    sendEvent(
      [
        {
          type: 'system',
          data: {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            name: 'sdk_start',
            evcs: 11130,
            urlPath: 'https://blotout.io/',
            tstmp: 1614584413700,
          },
        },
        {
          type: 'codified',
          data: {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            name: 'visibility_hidden',
            evcs: 11132,
            urlPath: 'https://blotout.io/',
            tstmp: 1614584313700,
          },
          extra: {
            foo: true,
          },
        },
      ],
      {
        method: 'beacon',
      }
    )
    expect(spy).toBeCalledWith(
      'https://domain.com/v1/publish',
      JSON.stringify({
        meta: {
          tz_offset: 0,
          user_id_created: 1580775120000,
          plf: 27,
          osv: '11.1.0',
          appv: '87.0.4280.101',
          dmft: 'Apple',
          dm: 'Intel Based',
          bnme: 'Chrome',
          osn: 'Mac OS',
        },
        events: [
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: 'key',
            evn: 'sdk_start',
            evcs: 11130,
            scrn: 'https://blotout.io/',
            evt: 1614584413700,
            session_id: '1580775120000',
            type: 'system',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: {},
          },
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: 'key',
            evn: 'visibility_hidden',
            evcs: 11132,
            scrn: 'https://blotout.io/',
            evt: 1614584313700,
            session_id: '1580775120000',
            type: 'codified',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: {
              foo: true,
            },
          },
        ],
      }),
      {
        method: 'beacon',
      }
    )
  })

  it('default data', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
    })
    setLocal(getUIDKey(), 'key')
    getSessionID()
    setDefaultEventData([], { foo: true })
    setDefaultEventData(['codified'], { foo1: true })
    sendEvent([
      {
        type: 'system',
        data: {
          mid:
            'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'sdk_start',
          evcs: 11130,
          urlPath: 'https://blotout.io/',
          tstmp: 1614584413700,
        },
      },
      {
        type: 'codified',
        data: {
          mid:
            'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'test',
          evcs: 21302,
          urlPath: 'https://blotout.io/',
          tstmp: 1614584313700,
        },
        extra: {
          foo3: true,
        },
      },
      {
        type: 'codified',
        data: {
          mid:
            'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'test',
          evcs: 21302,
          urlPath: 'https://blotout.io/',
          tstmp: 1614584313800,
        },
      },
    ])
    expect(spy).toBeCalledWith(
      'https://domain.com/v1/publish',
      JSON.stringify({
        meta: {
          tz_offset: 0,
          user_id_created: 1580775120000,
          plf: 27,
          osv: '11.1.0',
          appv: '87.0.4280.101',
          dmft: 'Apple',
          dm: 'Intel Based',
          bnme: 'Chrome',
          osn: 'Mac OS',
        },
        events: [
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: 'key',
            evn: 'sdk_start',
            evcs: 11130,
            scrn: 'https://blotout.io/',
            evt: 1614584413700,
            session_id: '1580775120000',
            type: 'system',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: {
              foo: true,
            },
          },
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: 'key',
            evn: 'test',
            evcs: 21302,
            scrn: 'https://blotout.io/',
            evt: 1614584313700,
            session_id: '1580775120000',
            type: 'codified',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: { foo: true, foo1: true, foo3: true },
          },
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: 'key',
            evn: 'test',
            evcs: 21302,
            scrn: 'https://blotout.io/',
            evt: 1614584313800,
            session_id: '1580775120000',
            type: 'codified',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: { foo: true, foo1: true },
          },
        ],
      }),
      undefined
    )
  })
})

describe('getSelector', () => {
  it('null', () => {
    expect(getSelector()).toBe('Unknown')
  })

  it('no identifiers', () => {
    const event = document.createElement('div')
    expect(getSelector(event)).toBe('DIV')
  })

  it('with id', () => {
    const event = document.createElement('p')
    event.setAttribute('id', 'test')
    expect(getSelector(event)).toBe('P#test')
  })

  it('with classname', () => {
    const event = document.createElement('p')
    event.setAttribute('class', 'test')
    expect(getSelector(event)).toBe('P.test')
  })
})

describe('getObjectTitle', () => {
  it('null', () => {
    expect(getObjectTitle(null)).toBeNull()
  })

  it('null', () => {
    expect(getObjectTitle(null)).toBeNull()
  })

  it('local name is missing', () => {
    const element = document.createElement('div')
    element.innerText = 'no'

    Object.defineProperty(element, 'localName', {
      value: null,
    })

    expect(getObjectTitle(element)).toBeNull()
  })

  it('h1', () => {
    const element = document.createElement('h1')
    element.innerText = 'hi'
    expect(getObjectTitle(element)).toBe('hi')
  })

  it('h1', () => {
    const element = document.createElement('div')
    element.innerText = 'hi'
    expect(getObjectTitle(element)).toBeNull()
  })
})
