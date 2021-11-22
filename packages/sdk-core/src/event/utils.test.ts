import { getObjectTitle, getSelector, sendEvent } from './utils'
import * as network from '../network'
import * as endPoint from '../network/endPoint'
import type { EventOptions } from '../typings'
import { setDefaultEventData } from './index'
import { getSessionID, setLocal } from '../storage'
import { getCreatedKey, getUIDKey } from '../storage/key'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
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
    sendEvent(
      [
        {
          type: 'system',
          data: {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            name: 'sdk_start',
            urlPath: 'https://blotout.io/',
            tstmp: 1614584413700,
          },
        },
        {
          type: 'codified',
          data: {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            name: 'visibility_hidden',
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
          plf: 27,
          osv: '11.1.0',
          appv: '87.0.4280.101',
          dmft: 'Apple',
          dm: 'Intel Based',
          bnme: 'Chrome',
          osn: 'Mac OS',
          page_title: '',
        },
        events: [
          {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            evn: 'sdk_start',
            scrn: 'https://blotout.io/',
            evt: 1614584413700,
            session_id: '1580775120000',
            type: 'system',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: {},
          },
          {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            evn: 'visibility_hidden',
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

  it('default data, with local data', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
    })
    setLocal(getCreatedKey(), '1580775120000')
    setLocal(getUIDKey(), 'key')
    getSessionID()
    setDefaultEventData([], { foo: true })
    setDefaultEventData(['codified'], { foo1: true })
    sendEvent([
      {
        type: 'system',
        data: {
          mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'sdk_start',
          urlPath: 'https://blotout.io/',
          tstmp: 1614584413700,
        },
      },
      {
        type: 'codified',
        data: {
          mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'test',
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
          mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          name: 'test',
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
          plf: 27,
          osv: '11.1.0',
          appv: '87.0.4280.101',
          dmft: 'Apple',
          dm: 'Intel Based',
          bnme: 'Chrome',
          osn: 'Mac OS',
          page_title: '',
          user_id_created: 1580775120000,
        },
        events: [
          {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            evn: 'sdk_start',
            scrn: 'https://blotout.io/',
            evt: 1614584413700,
            session_id: '1580775120000',
            type: 'system',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: {
              foo: true,
            },
            userid: 'key',
          },
          {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            evn: 'test',
            scrn: 'https://blotout.io/',
            evt: 1614584313700,
            session_id: '1580775120000',
            type: 'codified',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: { foo: true, foo1: true, foo3: true },
            userid: 'key',
          },
          {
            mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            evn: 'test',
            scrn: 'https://blotout.io/',
            evt: 1614584313800,
            session_id: '1580775120000',
            type: 'codified',
            screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            additionalData: { foo: true, foo1: true },
            userid: 'key',
          },
        ],
      }),
      undefined
    )
  })
})

describe('getSelector', () => {
  it('null', () => {
    expect(getSelector()).toBeNull()
  })

  it('no identifiers', () => {
    const element = document.createElement('div')
    expect(getSelector(element)).toBe('DIV')
  })

  it('with id', () => {
    const element = document.createElement('p')
    element.setAttribute('id', 'test')
    expect(getSelector(element)).toBe('P#test')
  })

  it('with classname', () => {
    const element = document.createElement('p')
    element.setAttribute('class', 'test')
    expect(getSelector(element)).toBe('P.test')
  })

  it('multiple classname', () => {
    const element = document.createElement('p')
    element.setAttribute('class', 'test ok')
    expect(getSelector(element)).toBe('P.test.ok')
  })

  it('classname is object', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const link = document.createElementNS('http://www.w3.org/2000/svg', 'a')
    link.setAttributeNS(null, 'className', 'geeks')
    svg.appendChild(link)
    expect(getSelector(svg)).toBe('svg')
  })
})

describe('getObjectTitle', () => {
  it('null', () => {
    expect(getObjectTitle(null)).toBeNull()
  })

  it('no tags', () => {
    const element = document.createElement('img')
    expect(getObjectTitle(element)).toBeNull()
  })

  it('image with alt', () => {
    const element = document.createElement('img')
    element.alt = 'alt text'

    expect(getObjectTitle(element)).toBe('alt text')
  })

  it('h1 with title', () => {
    const element = document.createElement('h1')
    element.title = 'hi'
    expect(getObjectTitle(element)).toBe('hi')
  })

  it('h1 no title', () => {
    const element = document.createElement('div')
    element.innerText = 'hi'
    expect(getObjectTitle(element)).toBe('hi')
  })

  it('div with a lot of text', () => {
    const element = document.createElement('div')
    element.innerText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the 
    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and 
    scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic 
    typesetting, remaining essentially unchanged.`

    expect(getObjectTitle(element)).toBe(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the '
    )
  })
})
