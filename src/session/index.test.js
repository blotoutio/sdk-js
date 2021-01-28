import * as eventSession from '../event/session'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { updatePreviousDayEndTime, updateEndTime } from './index'

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

  spySet = jest.spyOn(eventSession, 'setSessionForDate').mockImplementation()

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
      endTime: 1580775120000,
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
      endTime: 1580775120000,
    })
    spyEvents.mockRestore()
  })
})
