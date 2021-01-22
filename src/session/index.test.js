import * as eventSession from '../event/session'
import * as eventUtils from '../event/utils'
import * as storage from '../storage'
import * as utils from '../utils'
import * as timeUtil from '../common/timeUtil'
import { updatePreviousDayEndTime, updateEndTime, addSessionInfoEvent } from './index'

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

  spySet = jest
    .spyOn(eventSession, 'setSessionForDate')
    .mockImplementation()

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spyDate.mockRestore()
  spySet.mockRestore()
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('updatePreviousDayEndTime', () => {
  it('null', () => {
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('set endTime', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledWith('3-2-2020', 124123423, {
      endTime: 1580775120000
    })
    spyEvents.mockRestore()
  })
})

describe('updateEndTime', () => {
  it('null', () => {
    updateEndTime()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    updateEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('set endTime', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    updateEndTime()
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      endTime: 1580775120000
    })
    spyEvents.mockRestore()
  })
})

describe('addSessionInfoEvent', () => {
  it('collection is off', () => {
    const spySystem = jest
      .spyOn(eventUtils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)
    const result = addSessionInfoEvent()
    expect(result).toBeUndefined()
    spySystem.mockRestore()
  })

  it('null', () => {
    const result = addSessionInfoEvent()
    expect(result).toBeUndefined()
  })

  it('sessions is missing', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    const result = addSessionInfoEvent()
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('viewport is missing and end time is 0', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 2312313123,
        endTime: 0
      }))
    const result = addSessionInfoEvent([], [], '20-3-2020', 124123423)
    expect(result).toStrictEqual([
      [
        {
          evc: 10001,
          evcs: 11024,
          evdc: 1,
          evn: 'Session Info',
          evt: 1580775120000,
          mid: 'localhost-null-1580775120000',
          nmo: 1,
          properties: {
            duration: 0,
            end: 0,
            referrer: null,
            session_id: 124123423,
            start: 2312313123
          },
          scrn: 'http://localhost/',
          userid: null
        }
      ]
    ])
    spyEvents.mockRestore()
  })

  it('session event goes in the same chunk', () => {
    const spyCount = jest
      .spyOn(utils, 'getSystemMergeCounter')
      .mockImplementation(() => 2)
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 2312313123,
        endTime: 2313316123,
        viewPort: [
          {
            timeStamp: 314412412241242,
            width: 10,
            height: 20
          },
          {
            timeStamp: 314412412341242,
            width: 10,
            height: 20
          }
        ]
      }))
    const result = addSessionInfoEvent(
      [],
      [[
        {
          evn: 'Custom event'
        }
      ]],
      '20-3-2020',
      124123423)
    expect(result).toStrictEqual([
      [
        {
          evn: 'Custom event'
        },
        {
          evc: 10001,
          evcs: 11024,
          evdc: 1,
          evn: 'Session Info',
          evt: 1580775120000,
          mid: 'localhost-null-1580775120000',
          nmo: 1,
          properties: {
            duration: 1003,
            end: 2313316123,
            referrer: null,
            screen: {
              timeStamp: 314412412341242,
              width: 10,
              height: 20
            },
            session_id: 124123423,
            start: 2312313123
          },
          scrn: 'http://localhost/',
          userid: null
        }
      ]
    ])
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('session event goes in the same chunk', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        startTime: 2312313123,
        endTime: 2313316123,
        viewPort: []
      }))
    const result = addSessionInfoEvent(
      [],
      [[
        {
          evn: 'Custom event'
        }
      ]],
      '20-3-2020',
      124123423)
    expect(result).toStrictEqual([
      [
        {
          evn: 'Custom event'
        }
      ],
      [
        {
          evc: 10001,
          evcs: 11024,
          evdc: 1,
          evn: 'Session Info',
          evt: 1580775120000,
          mid: 'localhost-null-1580775120000',
          nmo: 1,
          properties: {
            duration: 1003,
            end: 2313316123,
            referrer: null,
            session_id: 124123423,
            start: 2312313123
          },
          scrn: 'http://localhost/',
          userid: null
        }
      ]
    ])
    spyEvents.mockRestore()
  })
})
