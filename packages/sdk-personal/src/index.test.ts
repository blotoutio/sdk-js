import { capturePersonal } from './index'
import {
  EventOptions,
  SendEvent,
  internalUtils,
  IncomingEvent,
  BasicEvent,
} from '@blotoutio/sdk-core'

describe('capturePersonal', () => {
  let spySend: jest.SpyInstance<void, [SendEvent[], EventOptions?]>
  let spyCreate: jest.SpyInstance<BasicEvent, [IncomingEvent]>

  beforeEach(() => {
    spySend = jest.spyOn(internalUtils, 'sendEvent').mockImplementation()
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
    const event = {
      name: '',
      data: {},
    }
    capturePersonal(event)
    expect(spySend).toBeCalledTimes(0)
  })

  it('options not defined, default to PII', () => {
    spyCreate = jest.spyOn(internalUtils, 'createBasicEvent').mockReturnValue({
      evcs: 23814,
      mid:
        'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
      name: 'custom event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
    const event = {
      name: 'custom event',
      data: {},
    }
    capturePersonal(event)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'pii',
          data: {
            evcs: 23814,
            mid:
              'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { data: '', iv: '', key: '' },
        },
      ],
      undefined
    )
    spyCreate.mockRestore()
  })

  it('PII', () => {
    spyCreate = jest.spyOn(internalUtils, 'createBasicEvent').mockReturnValue({
      evcs: 23814,
      mid:
        'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
      name: 'custom event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
    const event = {
      name: 'custom event',
      data: {
        foo: true,
      },
    }
    capturePersonal(event, false)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'pii',
          data: {
            evcs: 23814,
            mid:
              'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { data: '', iv: '', key: '' },
        },
      ],
      undefined
    )
    spyCreate.mockRestore()
  })

  it('PHI', () => {
    spyCreate = jest.spyOn(internalUtils, 'createBasicEvent').mockReturnValue({
      evcs: 23814,
      mid:
        'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
      name: 'custom event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
    const event = {
      name: 'custom event',
      data: {
        foo: true,
      },
    }

    capturePersonal(event, true)
    expect(spySend).toBeCalledWith(
      [
        {
          type: 'phi',
          data: {
            evcs: 23814,
            mid:
              'Y3VzdG9tIGV2ZW50-fa6bcd09-2cdf-4bc5-b935-c4ac2da08223-1580775120000',
            name: 'custom event',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { data: '', iv: '', key: '' },
        },
      ],
      undefined
    )
    spyCreate.mockRestore()
  })
})
