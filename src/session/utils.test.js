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
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
    const id = 1580775120000
    const spySet = jest
      .spyOn(storage, 'setSession')
      .mockImplementation()

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    expect(spySet).toHaveBeenCalledWith('sessionId', id)
    expect(spySet).toHaveBeenCalledWith('session_start_time', id)
    spySet.mockRestore()
    jest.useRealTimers()
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
    expect(result).toBe(null)
  })

  it('event data missing', () => {
    const result = getNotSynced({
      23423423: {}
    })
    expect(result).toBe(null)
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
    navigator.__defineGetter__('appVersion', () => '')
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
        dplatform: 'desktop',
        hostOS: '',
        osv: '0',
        plf: 70,
        ua: null,
        version: '0.0.0.0'
      },
      sdkVersion: undefined,
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

  it('with event', () => {
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Linux; U; Android 2.2; en-us; SCH-I800 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1')

    const result = createSessionObject('some_event', {
      data: false
    })
    expect(result).toStrictEqual({
      endTime: 0,
      eventsData: {
        devCodifiedEventsInfo: [],
        eventsInfo: {
          evc: 10001,
          evcs: undefined,
          extraInfo: {
            mousePosX: undefined,
            mousePosY: undefined
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
        },
        navigationPath: [
          'http://localhost/'
        ],
        sentToServer: false,
        stayTimeBeforeNav: []
      },
      geo: {},
      lastServerSyncTime: 0,
      meta: {
        browser: 'Safari',
        domain: 'localhost',
        dplatform: 'mobile',
        hostOS: '',
        osv: '0',
        plf: 16,
        ua: 'Mozilla/5.0 (Linux; U; Android 2.2; en-us; SCH-I800 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        version: '533'
      },
      sdkVersion: undefined,
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

  it('device is tablet', () => {
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
        browser: 'Safari',
        domain: 'localhost',
        dplatform: 'tablet',
        hostOS: '',
        osv: '0',
        plf: 70,
        ua: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
        version: '604'
      },
      sdkVersion: undefined,
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
    navigator.__defineGetter__('appVersion', () => '5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36')

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
        dplatform: 'desktop',
        hostOS: 'MacOS',
        osv: '0',
        plf: 70,
        ua: '',
        version: '0.0.0.0'
      },
      sdkVersion: undefined,
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
    navigator.__defineGetter__('appVersion', () => '5.0 (Windows; en-US)')

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
        dplatform: 'desktop',
        hostOS: 'Windows',
        osv: '0',
        plf: 70,
        ua: '',
        version: '0.0.0.0'
      },
      sdkVersion: undefined,
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
