import * as eventSession from '../event/session'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { setSessionPHIEvent, setSessionPIIEvent } from './personal'

let spySet
let spyDate
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

describe('setPersonalEvent', () => {
  it('null', () => {
    setSessionPIIEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    setSessionPIIEvent('personal', 'obName', {
      meta: true
    })
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    setSessionPIIEvent('personal', 'obName', {
      meta: true
    })
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no devCodifiedEventsInfo', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {}
      }))
    setSessionPIIEvent('personal', 'obName', {
      meta: true
    })
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      eventsData: {
        devCodifiedEventsInfo: [
          {
            evc: 20001,
            evcs: 23950,
            isPii: true,
            metaInfo: {
              meta: true
            },
            mid: 'localhost-null-1580775120000',
            name: 'personal',
            nmo: 1,
            objectName: 'obName',
            sentToServer: false,
            tstmp: 1580775120000,
            urlPath: 'http://localhost/'
          }
        ]
      }
    })
    spyEvents.mockRestore()
  })

  it('devCodifiedEventsInfo, sync in progress', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {
          devCodifiedEventsInfo: [
            {
              data: true
            }
          ]
        }
      }))

    setSessionPIIEvent('personal', 'obName', {
      meta: true
    })
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      eventsData: {
        devCodifiedEventsInfo: [
          {
            data: true
          },
          {
            evc: 20001,
            evcs: 23950,
            isPii: true,
            metaInfo: {
              meta: true
            },
            mid: 'localhost-null-1580775120000',
            name: 'personal',
            nmo: 1,
            objectName: 'obName',
            sentToServer: false,
            tstmp: 1580775120000,
            urlPath: 'http://localhost/'
          }
        ]
      }
    })
    spyEvents.mockRestore()
  })
})

describe('setSessionPHIEvent', () => {
  it('ok', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {
          devCodifiedEventsInfo: [
            {
              data: true
            }
          ]
        }
      }))

    setSessionPHIEvent('personal', 'obName', {
      meta: true
    })
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      eventsData: {
        devCodifiedEventsInfo: [
          {
            data: true
          },
          {
            evc: 20001,
            evcs: 23950,
            isPhi: true,
            metaInfo: {
              meta: true
            },
            mid: 'localhost-null-1580775120000',
            name: 'personal',
            nmo: 1,
            objectName: 'obName',
            sentToServer: false,
            tstmp: 1580775120000,
            urlPath: 'http://localhost/'
          }
        ]
      }
    })
    spyEvents.mockRestore()
  })
})
