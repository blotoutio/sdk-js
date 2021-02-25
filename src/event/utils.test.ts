import { createDevEvent } from './create'
import * as utilsGeneral from '../common/utils'
import { codeForDevEvent, getEventPayload } from './utils'
import * as storage from '../storage'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('codeForDevEvent', () => {
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

describe('createDevEvent', () => {
  let spyMid: jest.SpyInstance<string, []>

  beforeEach(() => {
    spyMid = jest
      .spyOn(utilsGeneral, 'getMid')
      .mockImplementation(() => 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423')
  })

  afterEach(() => {
    spyMid.mockRestore()
  })

  it('everything', () => {
    const result = createDevEvent({
      name: 'some_event',
      data: {
        custom: true,
      },
    })
    expect(result).toStrictEqual({
      evcs: 24146,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      metaInfo: {
        custom: true,
      },
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('with custom code', () => {
    const result = createDevEvent({
      name: 'some_event',
      data: { custom: true },
      code: 123123,
    })
    expect(result).toStrictEqual({
      evcs: 123123,
      metaInfo: {
        custom: true,
      },
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
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
