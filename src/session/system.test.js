import * as eventSession from '../event/session'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { setDNTEvent, setViewPort } from './system'

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

describe('setDNTEvent', () => {
  const event = {
    target: '#id'
  }
  it('null', () => {
    setDNTEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    setDNTEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('null events in session', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    setDNTEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('eventsInfo is missing', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {}
      }))
    setDNTEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('dnt event already set', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {
          eventsInfo: [
            {
              name: 'dnt'
            }
          ]
        }
      }))
    setDNTEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('dnt event created', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        eventsData: {
          eventsInfo: []
        }
      }))
    setDNTEvent(event)
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      eventsData: {
        eventsInfo: [
          {
            evc: 10001,
            evcs: 11502,
            extraInfo: {
              mousePosX: -1,
              mousePosY: -1
            },
            metaInfo: {},
            mid: '',
            name: 'dnt',
            nmo: 1,
            objectName: 'Unknown',
            objectTitle: '',
            position: {
              height: -1,
              width: -1,
              x: -1,
              y: -1
            },
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

describe('setViewPort', () => {
  it('null', () => {
    setViewPort()
    expect(spySet).toBeCalledTimes(0)
  })

  it('session is missing', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => null)
    setViewPort()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('viewPort is missing', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({}))
    setViewPort()
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      viewPort: [
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
    spyEvents.mockRestore()
  })

  it('viewPort is already there', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        viewPort: [{
          data: true
        }]
      }))
    setViewPort()
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      viewPort: [
        {
          data: true
        },
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0
        }
      ]
    })
    spyEvents.mockRestore()
  })
})
