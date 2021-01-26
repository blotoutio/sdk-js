import {
  codeForCustomCodifiedEvent,
  createDevEventInfoObj,
  getNavigationTime,
} from './utils'
import * as storage from '../storage/sharedPreferences'
import * as eventSession from './session'
import * as utilsGeneral from '../common/utils'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('codeForCustomCodifiedEvent', () => {
  it('null', () => {
    expect(codeForCustomCodifiedEvent()).toBe(0)
  })

  it('name has spaces', () => {
    expect(codeForCustomCodifiedEvent('some awesome event')).toBe(24016)
  })

  it('name with underscore', () => {
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24008)
  })

  it('non ascii name', () => {
    expect(codeForCustomCodifiedEvent('目_awesome_event')).toBe(24049)
  })

  it('long name', () => {
    expect(
      codeForCustomCodifiedEvent(
        'event event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_event'
      )
    ).toBe(23962)
  })

  it('event already exists with the same name for different events', () => {
    jest.spyOn(storage, 'getNormalUseValue').mockImplementation(() => ({
      event1: 24008,
      event2: 21545,
    }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24009)
  })

  it('event already exists with the same name same event', () => {
    jest.spyOn(storage, 'getNormalUseValue').mockImplementation(() => ({
      awesome_event: 24008,
      event2: 21545,
    }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24008)
  })
})

describe('getNavigationTime', () => {
  it('null', () => {
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('no navigation time', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 1608912608000,
        eventsData: {
          navigationPath: [],
          stayTimeBeforeNav: [],
          devCodifiedEventsInfo: [],
          sentToServer: false,
        },
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('get navigation time', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 1608912608000,
        eventsData: {
          navigationPath: [
            'http://localhost:8080/new_page.html',
            'http://localhost:8080/index.html',
          ],
          stayTimeBeforeNav: [1608913208000, 1608913328000],
          devCodifiedEventsInfo: [],
          sentToServer: false,
        },
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toStrictEqual([600, 120])
    spyEvents.mockRestore()
  })

  it('old state', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 1608912608000,
        eventsData: {
          navigationPath: [
            'http://localhost:8080/new_page.html',
            'http://localhost:8080/index.html',
          ],
          stayTimeBeforeNav: [20000, 300000],
          devCodifiedEventsInfo: [],
          sentToServer: false,
        },
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toStrictEqual([20000, 300000])
    spyEvents.mockRestore()
  })
})

describe('createDevEventInfoObj', () => {
  let spyMid

  beforeEach(() => {
    spyMid = jest
      .spyOn(utilsGeneral, 'getMid')
      .mockImplementation(() => 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423')
  })

  afterEach(() => {
    spyMid.mockRestore()
  })

  it('null', () => {
    const result = createDevEventInfoObj()
    expect(result).toStrictEqual({
      evc: 20001,
      evcs: 0,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      nmo: 1,
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('with just event', () => {
    const result = createDevEventInfoObj('some_event')
    expect(result).toStrictEqual({
      evc: 20001,
      evcs: 24146,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      nmo: 1,
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('everything', () => {
    const result = createDevEventInfoObj('some_event', 'objName', {
      custom: true,
    })
    expect(result).toStrictEqual({
      evc: 20001,
      evcs: 24146,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      metaInfo: {
        custom: true,
      },
      objectName: 'objName',
      nmo: 1,
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('with custom code', () => {
    const result = createDevEventInfoObj(
      'some_event',
      'objName',
      { custom: true },
      123123
    )
    expect(result).toStrictEqual({
      evc: 20001,
      evcs: 123123,
      metaInfo: {
        custom: true,
      },
      objectName: 'objName',
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      nmo: 1,
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })
})
