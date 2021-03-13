import { capturePersonal } from './index'
import * as eventUtils from '../event/utils'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('capturePersonal', () => {
  let spySend: jest.SpyInstance<void, [SendEvent[], EventOptions?]>

  beforeEach(() => {
    spySend = jest.spyOn(eventUtils, 'sendEvent').mockImplementation()
  })

  afterEach(() => {
    spySend.mockReset()
  })

  afterAll(() => {
    spySend.mockRestore()
  })

  it('null', () => {
    capturePersonal(null)
    expect(spySend).toBeCalledTimes(0)
  })

  it('name empty', () => {
    const event: IncomingEvent = {
      name: '',
      data: {},
    }
    capturePersonal(event)
    expect(spySend).toBeCalledTimes(0)
  })

  it('options not defined, default to PII', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {},
    }
    capturePersonal(event)
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 23814,
            metaInfo: null,
            mid: 'localhost-null-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { pii: { data: '', iv: '', key: '' } },
        },
      ],
      undefined
    )
  })

  it('PII', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {
        foo: true,
      },
    }
    capturePersonal(event, false)
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 23814,
            metaInfo: null,
            mid: 'localhost-null-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { pii: { data: '', iv: '', key: '' } },
        },
      ],
      undefined
    )
  })

  it('PHI', () => {
    const event: IncomingEvent = {
      name: 'custom event',
      data: {
        foo: true,
      },
    }

    capturePersonal(event, true)
    expect(spySend).toBeCalledWith(
      [
        {
          data: {
            evcs: 23814,
            metaInfo: null,
            mid: 'localhost-null-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { phi: { data: '', iv: '', key: '' } },
        },
      ],
      undefined
    )
  })
})
