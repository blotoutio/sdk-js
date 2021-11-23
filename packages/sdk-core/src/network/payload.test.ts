import { getPayload } from './payload'
import * as storage from '../storage'

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
    const result = getPayload([
      {
        mid: 'blotout.io-64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84-1614584413700',
        userid:
          '64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84',
        evn: 'sdk_start',
        evcs: 11130,
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
          evcs: 11130,
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
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
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
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('Android mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; U; Android 4.0.3; nl-nl; GT-I9000 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '4.0',
        bnme: 'Android Browser',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '4.0.3',
        page_title: '',
        osn: 'Android',
        plf: 11,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('iPad', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '12.1',
        bnme: 'Mobile Safari',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '12.2',
        page_title: '',
        osn: 'iOS',
        plf: 15,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('OS is Mac', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '87.0.4280.101',
        bnme: 'Chrome',
        dm: 'Intel Based',
        dmft: 'Apple',
        osv: '11.1.0',
        page_title: '',
        osn: 'Mac OS',
        plf: 27,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('OS is Windows', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.47',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '87.0.664.47',
        bnme: 'Edge',
        dm: 'AMD Based',
        dmft: 'Microsoft',
        osv: '10',
        page_title: '',
        osn: 'Windows',
        plf: 26,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('OS is Linux', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.127 Safari/534.16',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '10.0.648.127',
        bnme: 'Chrome',
        dm: 'AMD Based',
        dmft: 'Ubuntu',
        osv: 'i686',
        page_title: '',
        osn: 'Linux',
        plf: 28,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('other phone', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (ZTE-E_N72/N72V1.0.0B02;U;Windows Mobile/6.1;Profile/MIDP-2.0 Configuration/CLDC-1.1;320*240;CTC/2.0) IE/6.0 (compatible; MSIE 4.01; Windows CE; PPC)/UC Browser7.7.1.88',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '4.01',
        bnme: 'IE',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '6.1',
        page_title: '',
        osn: 'Windows Mobile',
        plf: 16,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('other tablet', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; U; Android 3.2; de-de; Sony Tablet P Build/THMD01900) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '4.0',
        bnme: 'Android Browser',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '3.2',
        page_title: '',
        osn: 'Android',
        plf: 12,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('iPhone', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '3.1.1',
        bnme: 'Mobile Safari',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '2.1',
        page_title: '',
        osn: 'iOS',
        plf: 14,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('ios mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '3.1.1',
        bnme: 'Mobile Safari',
        dm: 'ARM Based',
        dmft: 'unknown',
        osv: '2.1',
        page_title: '',
        osn: 'iOS',
        plf: 14,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('apple tv', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'AppleTV6,2/11.1',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('android mobile', () => {
    Object.defineProperty(navigator, 'brave', {
      value: {},
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '0.0.0.0',
        bnme: 'Brave',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('android player ', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus Player Build/MMB29T)',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '6.0.1',
        page_title: '',
        osn: 'Android',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
  })

  it('Unix ', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Unix) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7',
      configurable: true,
    })

    const result = getPayload([])
    expect(result).toStrictEqual({
      events: [],
      meta: {
        appv: '16.0.912.77',
        bnme: 'Chrome',
        dm: 'AMD Based',
        dmft: 'Unix',
        osn: 'Unix',
        osv: '0',
        page_title: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
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
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
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
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        referrer: 'https://domain.com',
        sdkv: undefined,
        search: '?key=value',
        tz_offset: -0,
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
        appv: '0.0.0.0',
        bnme: 'unknown',
        dm: 'AMD Based',
        dmft: 'unknown',
        osv: '0',
        page_title: '',
        osn: '',
        plf: 70,
        sdkv: undefined,
        tz_offset: -0,
      },
    })
    spySession.mockRestore()
  })
})
