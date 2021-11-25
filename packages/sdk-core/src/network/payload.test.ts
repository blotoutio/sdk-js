import { getPayload } from './payload'
import * as storage from '../storage'
import * as utils from '../common/utils'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('getPayload', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: '',
      configurable: true,
    })
  })

  afterEach(() => {
    navigator.brave = undefined
  })

  it('basic', () => {
    const ua =
      '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    Object.defineProperty(navigator, 'userAgent', {
      value: ua,
      configurable: true,
    })

    const result = getPayload([
      {
        mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
        userid:
          '64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84',
        evn: 'sdk_start',
        scrn: 'https://blotout.io/',
        evt: 1614584413700,
        session_id: '1614584413698',
        type: 'system',
        screen: {
          width: 1497,
          height: 1560,
          docHeight: 2730,
          docWidth: 1497,
        },
      },
    ])
    expect(result).toStrictEqual({
      events: [
        {
          mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
          userid:
            '64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84',
          evn: 'sdk_start',
          scrn: 'https://blotout.io/',
          evt: 1614584413700,
          session_id: '1614584413698',
          type: 'system',
          screen: {
            width: 1497,
            height: 1560,
            docHeight: 2730,
            docWidth: 1497,
          },
        },
      ],
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: ua,
      },
    })
  })

  it('UA null', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: null,
      configurable: true,
    })

    const result = getPayload()
    expect(result).toStrictEqual({
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: null,
      },
    })
  })

  it('Brave browser', () => {
    const ua =
      '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    Object.defineProperty(navigator, 'userAgent', {
      value: ua,
      configurable: true,
    })

    navigator.brave = true

    const result = getPayload()
    expect(result).toStrictEqual({
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: `${ua} Brave`,
      },
    })
  })

  it('session data is corrupted', () => {
    const spy = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => 'sdfdsf[')
    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: '',
      },
    })
    spy.mockRestore()
  })

  it('session data', () => {
    const spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() =>
        JSON.stringify({
          referrer: 'https://domain.com',
          search: '?key=value',
        })
      )
    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        page_title: '',
        referrer: 'https://domain.com',
        sdkv: undefined,
        search: '?key=value',
        tz_offset: -0,
        user_agent: '',
      },
    })
    spySession.mockRestore()
  })

  it('session data empty', () => {
    const spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() =>
        JSON.stringify({
          test: true,
        })
      )
    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: '',
      },
    })
    spySession.mockRestore()
  })

  it('migration path for user created', () => {
    const spySession = jest
      .spyOn(utils, 'getCreateTimestamp')
      .mockImplementation(() => 1637815412226)

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        page_title: '',
        sdkv: undefined,
        tz_offset: -0,
        user_agent: '',
        user_id_created: 1637815412226,
      },
    })
    spySession.mockRestore()
  })
})
