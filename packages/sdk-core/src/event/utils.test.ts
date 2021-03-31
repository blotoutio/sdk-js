import {
  codeForDevEvent,
  getEventPayload,
  getSelector,
  sendEvent,
  shouldCollectSystemEvents,
} from './utils'
import * as storage from '../storage'
import * as network from '../network'
import * as endPoint from '../network/endPoint'
import * as manifest from '../common/manifest'
import type { EventOptions } from '../typings'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('shouldCollectSystemEvents', () => {
  it('null', () => {
    expect(shouldCollectSystemEvents()).toBe(false)
  })

  it('variable', () => {
    const spy = jest.spyOn(manifest, 'getVariable').mockImplementation(() => 1)
    expect(shouldCollectSystemEvents()).toBe(true)
    spy.mockRestore()
  })
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

describe('getEventPayload', () => {
  let spySession: jest.SpyInstance<string, [string]>

  beforeEach(() => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => 'aosdfkaosfkoaskfo23e23-23423423423')
  })

  afterEach(() => {
    spySession.mockRestore()
  })

  it('system event', () => {
    const result = getEventPayload({
      name: 'click',
      urlPath: 'https://blotout.io',
      tstmp: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      evcs: 123123,
    })

    expect(result).toStrictEqual({
      evcs: 123123,
      evn: 'click',
      evt: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      properties: {
        screen: { docHeight: 0, docWidth: 0, height: 0, width: 0 },
        session_id: 'aosdfkaosfkoaskfo23e23-23423423423',
      },
      scrn: 'https://blotout.io',
      userid: null,
    })
  })

  it('system event with data', () => {
    const result = getEventPayload({
      name: 'click',
      urlPath: 'https://blotout.io',
      tstmp: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      evcs: 123123,
      objectName: 'name',
      objectTitle: 'a.link',
      position: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      mouse: {
        x: 400,
        y: 500,
      },
    })

    expect(result).toStrictEqual({
      evcs: 123123,
      evn: 'click',
      evt: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      properties: {
        screen: { docHeight: 0, docWidth: 0, height: 0, width: 0 },
        session_id: 'aosdfkaosfkoaskfo23e23-23423423423',
        obj: 'name',
        objT: 'a.link',
        position: {
          x: 10,
          y: 20,
          width: 30,
          height: 40,
        },
        mouse: {
          x: 400,
          y: 500,
        },
      },
      scrn: 'https://blotout.io',
      userid: null,
    })
  })

  it('dev event', () => {
    const result = getEventPayload({
      name: 'click',
      urlPath: 'https://blotout.io',
      tstmp: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      evcs: 123123,
      metaInfo: {
        data: false,
      },
    })

    expect(result).toStrictEqual({
      evcs: 123123,
      evn: 'click',
      evt: 1580775120000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      properties: {
        screen: { docHeight: 0, docWidth: 0, height: 0, width: 0 },
        session_id: 'aosdfkaosfkoaskfo23e23-23423423423',
        codifiedInfo: {
          data: false,
        },
      },
      scrn: 'https://blotout.io',
      userid: null,
    })
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
    sendEvent(
      [
        {
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
          data: {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            name: 'visibility_hidden',
            evcs: 11132,
            urlPath: 'https://blotout.io/',
            tstmp: 1614584313700,
          },
          extra: {
            pii: {
              data: 'dfsdfsdfds',
              iv: 'sdfsdfdsfsd',
              key: 'dfsfdsf',
            },
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
          plf: 70,
          appn: 'localhost',
          osv: '0',
          appv: '537.36',
          dmft: 'unknown',
          dm: 'Intel Based',
          bnme: 'WebKit',
          dplatform: 'unknown',
        },
        events: [
          {
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: null,
            evn: 'sdk_start',
            evcs: 11130,
            scrn: 'https://blotout.io/',
            evt: 1614584413700,
            properties: {
              session_id: '1580775120000',
              screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            },
          },
          {
            pii: { data: 'dfsdfsdfds', iv: 'sdfsdfdsfsd', key: 'dfsfdsf' },
            mid:
              'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
            userid: null,
            evn: 'visibility_hidden',
            evcs: 11132,
            scrn: 'https://blotout.io/',
            evt: 1614584313700,
            properties: {
              session_id: '1580775120000',
              screen: { width: 0, height: 0, docHeight: 0, docWidth: 0 },
            },
          },
        ],
      }),
      {
        method: 'beacon',
      }
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
