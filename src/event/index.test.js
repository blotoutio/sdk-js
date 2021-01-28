import * as eventStorage from './storage'
import * as eventSession from './session'
import * as eventUtils from './utils'
import * as utils from '../common/utils'
import * as storage from '../storage'
import * as network from '../common/networkUtil'
import * as timeUtil from '../common/timeUtil'
import { mapIDEvent, sendStartEvent, syncPreviousEvents } from '.'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

let spyDate
let spySet
let spySession
beforeEach(() => {
  spyDate = jest
    .spyOn(timeUtil, 'getStringDate')
    .mockImplementation(() => '20-3-2020')

  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation(() => 124123423)

  spySet = jest.spyOn(eventStorage, 'setEventsByDate').mockImplementation()

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spyDate.mockRestore()
  spySet.mockRestore()
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('syncPreviousEvents', () => {
  let spyPost

  beforeEach(() => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    spyPost.mockRestore()
  })

  it('null', () => {
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('same session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              sentToServer: false,
            },
          },
        },
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('nothing to sync', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true,
            },
          },
        },
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('do not collect system events', () => {
    const spySystem = jest
      .spyOn(eventUtils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true,
            },
          },
        },
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spySystem.mockRestore()
    spyEvents.mockRestore()
  })

  it('few events', () => {
    const spyCount = jest
      .spyOn(utils, 'getSystemMergeCounter')
      .mockImplementation(() => 2)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536,
              },
            ],
            startTime: 1231312321,
            endTime: 0,
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init',
                },
                {
                  sentToServer: false,
                  name: 'load',
                },
                {
                  sentToServer: false,
                  name: 'click',
                },
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false,
                  name: 'custom_event',
                },
              ],
            },
          },
        },
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledWith(
      '',
      '{"events":[{"userid":null,"evn":"init","properties":{"referrer":"none","session_id":"12341234213","screen":{"timeStamp":1608506665536}}},{"userid":null,"evn":"load","properties":{"referrer":"none","session_id":"12341234213","screen":{"timeStamp":1608506665536}}},{"userid":null,"evn":"custom_event","properties":{"referrer":"none","session_id":"12341234213","screen":{"timeStamp":1608506665536}}}]}'
    )
    expect(spyPost).toBeCalledWith(
      '',
      '{"events":[{"userid":null,"evn":"click","properties":{"referrer":"none","session_id":"12341234213","screen":{"timeStamp":1608506665536}}}]}'
    )
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('payload is empty', () => {
    const spyPayload = jest
      .spyOn(eventUtils, 'getEventPayloadArr')
      .mockImplementation(() => [])
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536,
              },
            ],
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init',
                },
                {
                  sentToServer: false,
                  name: 'load',
                },
                {
                  sentToServer: false,
                  name: 'click',
                },
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false,
                },
              ],
            },
          },
        },
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
    spyPayload.mockRestore()
  })
})

describe('mapIDEvent', () => {
  let spySet
  beforeEach(() => {
    spySet = jest.spyOn(eventSession, 'setDevEvent').mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('null', () => {
    mapIDEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no data', () => {
    mapIDEvent('sdfasfasdfds', 'service')
    expect(spySet).toBeCalledWith(
      'map_id',
      {
        map_id: 'sdfasfasdfds',
        map_provider: 'service',
      },
      21001
    )
  })

  it('with data', () => {
    mapIDEvent('sdfasfasdfds', 'service', { custom: true })
    expect(spySet).toBeCalledWith(
      'map_id',
      {
        map_id: 'sdfasfasdfds',
        map_provider: 'service',
        custom: true,
      },
      21001
    )
  })
})

describe('sendStartEvent', () => {
  it('ok', () => {
    const spySend = jest.spyOn(eventUtils, 'sendEvents').mockImplementation()
    sendStartEvent()
    expect(spySend).toBeCalledWith([
      {
        evcs: 11130,
        mid: 'localhost-null-1580775120000',
        name: 'sdk_start',
        sentToServer: false,
        tstmp: 1580775120000,
        urlPath: 'http://localhost/',
      },
    ])
    spySend.mockRestore()
  })
})
