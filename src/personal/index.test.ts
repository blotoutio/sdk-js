import { handlePersonalEvent } from './index'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('handlePersonalEvent', () => {
  it('null', () => {
    expect(handlePersonalEvent(null)).toBeNull()
  })

  it('no options', () => {
    const event = {
      name: 'custom event',
      data: {},
    }
    expect(handlePersonalEvent(event)).toBeFalsy()
  })

  it('no PII/PHI', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {},
      options: {
        method: 'beacon',
      },
    }
    expect(handlePersonalEvent(event)).toBeFalsy()
  })

  it('name empty', () => {
    const event: IncomingEvent = {
      name: '',
      data: {},
      options: {
        PII: true,
      },
    }
    expect(handlePersonalEvent(event)).toBeNull()
  })

  it('name empty', () => {
    const event: IncomingEvent = {
      name: '',
      data: {},
      options: {
        PII: true,
      },
    }
    expect(handlePersonalEvent(event)).toBeNull()
  })

  it('PII', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {
        foo: true,
      },
      options: {
        PII: true,
      },
    }
    expect(handlePersonalEvent(event)).toStrictEqual({
      data: {
        evcs: 23814,
        metaInfo: null,
        mid: 'localhost-null-1580775120000',
        name: 'custom event',
        tstmp: 1580775120000,
        urlPath: 'http://localhost/',
      },
      extra: { pii: { data: '', iv: '', key: '' } },
    })
  })

  it('PHI', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {
        foo: true,
      },
      options: {
        PHI: true,
      },
    }
    expect(handlePersonalEvent(event)).toStrictEqual({
      data: {
        evcs: 23814,
        metaInfo: null,
        mid: 'localhost-null-1580775120000',
        name: 'custom event',
        tstmp: 1580775120000,
        urlPath: 'http://localhost/',
      },
      extra: { phi: { data: '', iv: '', key: '' } },
    })
  })
})
