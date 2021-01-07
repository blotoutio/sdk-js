import { checkAndGetSessionId, createSessionObject, getNotSynced, maybeSync } from './utils'
import * as storage from '../storage'
import * as event from '../event'
import * as manifest from '../manifest'
import { eventSync } from '../event/utils'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('eventSync', () => {
  beforeEach(() => {
    eventSync.progressStatus = false
  })

  it('default', () => {
    const result = eventSync.inProgress
    expect(result).toBe(false)
  })

  it('set/get', () => {
    expect(eventSync.progressStatus).toBe(false)
    eventSync.progressStatus = true
    expect(eventSync.progressStatus).toBe(true)
  })
})

describe('checkAndGetSessionId', () => {
  it('session do no exist yet', () => {
    const id = 1580775120000
    const spySet = jest
      .spyOn(storage, 'setSession')
      .mockImplementation()

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    expect(spySet).toHaveBeenCalledWith('sessionId', id)
    expect(spySet).toHaveBeenCalledWith('session_start_time', id)
    spySet.mockRestore()
  })

  it('session exists', () => {
    const id = Date.now()
    const spyGet = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => id)

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    spyGet.mockRestore()
  })
})

describe('getNotSynced', () => {
  it('null', () => {
    const result = getNotSynced()
    expect(result).toBeNull()
  })

  it('event data missing', () => {
    const result = getNotSynced({
      23423423: {}
    })
    expect(result).toBeNull()
  })

  it('session in between was missed', () => {
    const result = getNotSynced({
      23423423: {
        eventsData: {
          sentToServer: true
        }
      },
      23423424: {
        eventsData: {
          sentToServer: false
        }
      },
      23423425: {
        eventsData: {
          sentToServer: true
        }
      }
    })
    expect(result).toBe('23423424')
  })

  it('last session', () => {
    const result = getNotSynced({
      23423423: {
        eventsData: {
          sentToServer: true
        }
      },
      23423424: {
        eventsData: {
          sentToServer: false
        }
      }
    })
    expect(result).toBe('23423424')
  })
})

describe('maybeSync', () => {
  let spySync

  beforeEach(() => {
    spySync = jest
      .spyOn(event, 'syncEvents')
      .mockImplementation()
    eventSync.progressStatus = false
  })

  afterEach(() => {
    spySync.mockRestore()
  })

  it('null', () => {
    maybeSync()
    expect(spySync).toBeCalledTimes(0)
  })

  it('missing devCodifiedEventsInfo', () => {
    maybeSync({
      eventsInfo: []
    })
    expect(spySync).toBeCalledTimes(0)
    expect(eventSync.progressStatus).toBe(false)
  })

  it('event push, no sync in progress', () => {
    const spyManifest = jest
      .spyOn(manifest, 'getManifestVariable')
      .mockImplementation(() => 1)
    maybeSync({
      eventsInfo: [
        {
          sentToServer: false
        }
      ],
      devCodifiedEventsInfo: [
        {
          sentToServer: false
        },
        {
          sentToServer: false
        }
      ]
    })
    expect(spySync).toBeCalledTimes(1)
    expect(eventSync.progressStatus).toBe(true)
    spyManifest.mockRestore()
  })
})

describe('createSessionObject', () => {
  beforeEach(() => {
    navigator.__defineGetter__('userAgent', () => '')
  })

  it('null', () => {
    navigator.__defineGetter__('userAgent', () => null)
    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'unknown',
        domain: 'localhost',
        dplatform: 'unknown',
        hostOS: '',
        osv: '0',
        plf: 70,
        ua: null,
        version: '0.0.0.0',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('with event, Android mobile', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Linux; U; Android 4.0.3; nl-nl; GT-I9000 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30')

    const result = createSessionObject('some_event', {
      data: false
    })
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [
          {
            evc: 10001,
            evcs: undefined,
            extraInfo: {
              mousePosX: -1,
              mousePosY: -1
            },
            metaInfo: {},
            mid: '',
            name: 'some_event',
            nmo: 1,
            objectName: {
              data: false
            },
            objectTitle: '',
            position: {
              height: -1,
              width: -1,
              x: -1,
              y: -1
            },
            sentToServer: false,
            tstmp: 1580775120000,
            urlPath: 'http://localhost/'
          }
        ],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Android Browser',
        domain: 'localhost',
        dplatform: 'mobile',
        hostOS: 'Android',
        osv: '4.0.3',
        plf: 11,
        ua: 'Mozilla/5.0 (Linux; U; Android 4.0.3; nl-nl; GT-I9000 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        version: '4.0',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('iPad', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1')
    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Mobile Safari',
        domain: 'localhost',
        dplatform: 'tablet',
        hostOS: 'iOS',
        osv: '12.2',
        plf: 15,
        ua: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
        version: '12.1',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('OS is Mac', () => {
    navigator.__defineGetter__('userAgent', () => '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Chrome',
        domain: 'localhost',
        dplatform: 'unknown',
        hostOS: 'Mac OS',
        osv: '11.1.0',
        plf: 27,
        ua: '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
        version: '87.0.4280.101',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('OS is Windows', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.47')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Edge',
        domain: 'localhost',
        dplatform: 'unknown',
        hostOS: 'Windows',
        osv: '10',
        plf: 26,
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.47',
        version: '87.0.664.47',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('OS is Linux', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.127 Safari/534.16')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Chrome',
        domain: 'localhost',
        dplatform: 'unknown',
        hostOS: 'Linux',
        osv: 'i686',
        plf: 28,
        ua: 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.127 Safari/534.16',
        version: '10.0.648.127',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('other phone', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (ZTE-E_N72/N72V1.0.0B02;U;Windows Mobile/6.1;Profile/MIDP-2.0 Configuration/CLDC-1.1;320*240;CTC/2.0) IE/6.0 (compatible; MSIE 4.01; Windows CE; PPC)/UC Browser7.7.1.88')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'IE',
        domain: 'localhost',
        dplatform: 'mobile',
        hostOS: 'Windows Mobile',
        osv: '6.1',
        plf: 16,
        ua: 'Mozilla/5.0 (ZTE-E_N72/N72V1.0.0B02;U;Windows Mobile/6.1;Profile/MIDP-2.0 Configuration/CLDC-1.1;320*240;CTC/2.0) IE/6.0 (compatible; MSIE 4.01; Windows CE; PPC)/UC Browser7.7.1.88',
        version: '4.01',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('other tablet', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Linux; U; Android 3.2; de-de; Sony Tablet P Build/THMD01900) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Android Browser',
        domain: 'localhost',
        dplatform: 'tablet',
        hostOS: 'Android',
        osv: '3.2',
        plf: 12,
        ua: 'Mozilla/5.0 (Linux; U; Android 3.2; de-de; Sony Tablet P Build/THMD01900) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13',
        version: '4.0',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('iPhone', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Mobile Safari',
        domain: 'localhost',
        dplatform: 'mobile',
        hostOS: 'iOS',
        osv: '2.1',
        plf: 14,
        ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
        version: '3.1.1',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })

  it('Android mobile', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20')

    const result = createSessionObject()
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: [],
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Mobile Safari',
        domain: 'localhost',
        dplatform: 'mobile',
        hostOS: 'iOS',
        osv: '2.1',
        plf: 14,
        ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
        version: '3.1.1',
        sdkVersion: undefined,
        timeZoneOffset: 0
      },
      startTime: 1580775120000,
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
  })
})
