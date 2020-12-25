import { codeForCustomCodifiedEvent, getNavigationTime } from './utils'
import * as storage from '../storage/sharedPreferences'
import * as eventStorage from './storage'

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
    expect(codeForCustomCodifiedEvent('event event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_event')).toBe(23962)
  })

  it('event already exists with the same name for different events', () => {
    jest
      .spyOn(storage, 'getNormalUseValue')
      .mockImplementation(() => ({
        event1: 24008,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24009)
  })

  it('event already exists with the same name same event', () => {
    jest
      .spyOn(storage, 'getNormalUseValue')
      .mockImplementation(() => ({
        awesome_event: 24008,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24008)
  })
})

describe('getNavigationTime', () => {
  it('null', () => {
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('no navigation time', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            startTime: 1608912608000,
            eventsData: {
              navigationPath: [],
              stayTimeBeforeNav: [],
              devCodifiedEventsInfo: [],
              sentToServer: false
            }
          }
        }
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result).toBeUndefined()
    spyEvents.mockRestore()
  })

  it('get navigation time', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            startTime: 1608912608000,
            eventsData: {
              navigationPath: [
                'http://localhost:8080/new_page.html',
                'http://localhost:8080/index.html'
              ],
              stayTimeBeforeNav: [
                1608913208000,
                1608913328000
              ],
              devCodifiedEventsInfo: [],
              sentToServer: false
            }
          }
        }
      }))
    const result = getNavigationTime(124123423, '20-3-2020')
    expect(result.length).toBe(2)
    expect(result).toStrictEqual([600, 120])
    spyEvents.mockRestore()
  })
})
