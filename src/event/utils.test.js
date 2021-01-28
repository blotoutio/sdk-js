import { codeForCustomCodifiedEvent, createDevEventInfoObj } from './utils'
import * as storage from '../storage/sharedPreferences'
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
