import { createDevEvent } from './create'
import * as utilsGeneral from '../common/utils'
import { codeForDevEvent } from './utils'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('codeForDevEvent', () => {
  it('null', () => {
    expect(codeForDevEvent()).toBe(0)
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

describe('createDevEvent', () => {
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
    const result = createDevEvent()
    expect(result).toBeNull()
  })

  it('with just event', () => {
    const result = createDevEvent({ name: 'some_event' })
    expect(result).toStrictEqual({
      evcs: 24146,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      name: 'some_event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
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
