import { capturePersonal } from './index'
import {
  EventOptions,
  SendEvent,
  internalUtils,
  IncomingEvent,
  BasicEvent,
  Manifest,
} from '@blotoutio/sdk-core'

expect.extend({
  toBeCalledWithSendEvent(received: jest.Mock, expected: Array<unknown>) {
    const calls = received.mock.calls[0][0]
    // event
    const event = calls[0]
    if (
      event.extra.data.length === 0 ||
      event.extra.iv.length === 0 ||
      event.extra.key.length === 0
    ) {
      const message = () => `Event don't have extra: ${event}`
      return { pass: false, message }
    }

    delete event.extra
    if (JSON.stringify(event) !== JSON.stringify(expected[0])) {
      const message = () => `
      Expected: ${JSON.stringify(expected[0])}
      Received: ${JSON.stringify(event)}`
      return { pass: false, message }
    }

    // options
    if (calls[1] !== expected[1]) {
      const message = () => `
      Expected: ${JSON.stringify(expected[1])}
      Received: ${JSON.stringify(calls[1])}`
      return { pass: false, message }
    }

    return { pass: true, message: () => `All good` }
  },
})

describe('capturePersonal', () => {
  let spySend: jest.SpyInstance<void, [SendEvent[], EventOptions?]>
  let spyVariable: jest.SpyInstance<
    string | number | boolean,
    [key: keyof Manifest]
  >
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
    spyVariable = jest
      .spyOn(internalUtils, 'getVariable')
      .mockReturnValue(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWEAg0UxT2J7ceg69UYYdz8kv0D9MzkFpHRdSetzxnzzQTV+0TP1y+wnoIW4jGg6dyOix' +
          '7SIy4uwiAX7VXYF8Tx2XaLnwWGsU8g1kkNZVw6r+9WGg9Pt1udAKDbfyW+DlGrc1okfP+zi1TzAZIpBd8KphplBgJkmqWRchQwToZVQIDAQAB'
      )
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
    expect(spySend).toBeCalledWithSendEvent([
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
      },
      undefined,
    ])
    spyCreate.mockRestore()
    spyVariable.mockRestore()
  })

  it('keys are null', () => {
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
    expect(spySend).toBeCalledTimes(0)
    spyCreate.mockRestore()
  })

  it('PII', () => {
    spyVariable = jest
      .spyOn(internalUtils, 'getVariable')
      .mockReturnValue(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWEAg0UxT2J7ceg69UYYdz8kv0D9MzkFpHRdSetzxnzzQTV+0TP1y+wnoIW4jGg6dyOix' +
          '7SIy4uwiAX7VXYF8Tx2XaLnwWGsU8g1kkNZVw6r+9WGg9Pt1udAKDbfyW+DlGrc1okfP+zi1TzAZIpBd8KphplBgJkmqWRchQwToZVQIDAQAB'
      )
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
    expect(spySend).toBeCalledWithSendEvent(
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
        },
      ],
      undefined
    )
    spyCreate.mockRestore()
    spyVariable.mockRestore()
  })

  it('PHI', () => {
    spyVariable = jest
      .spyOn(internalUtils, 'getVariable')
      .mockReturnValue(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWEAg0UxT2J7ceg69UYYdz8kv0D9MzkFpHRdSetzxnzzQTV+0TP1y+wnoIW4jGg6dyOix' +
          '7SIy4uwiAX7VXYF8Tx2XaLnwWGsU8g1kkNZVw6r+9WGg9Pt1udAKDbfyW+DlGrc1okfP+zi1TzAZIpBd8KphplBgJkmqWRchQwToZVQIDAQAB'
      )
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
    expect(spySend).toBeCalledWithSendEvent(
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
        },
      ],
      undefined
    )
    spyCreate.mockRestore()
    spyVariable.mockRestore()
  })
})
