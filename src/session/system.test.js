import * as eventSession from '../event/session'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { setViewPort } from './system'

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
          width: 0,
        },
      ],
    })
    spyEvents.mockRestore()
  })

  it('viewPort is already there', () => {
    const spyEvents = jest
      .spyOn(eventSession, 'getSessionForDate')
      .mockImplementation(() => ({
        viewPort: [
          {
            data: true,
          },
        ],
      }))
    setViewPort()
    expect(spySet).toBeCalledWith('20-3-2020', 124123423, {
      viewPort: [
        {
          data: true,
        },
        {
          docHeight: 0,
          docWidth: 0,
          height: 0,
          timeStamp: 1580775120000,
          width: 0,
        },
      ],
    })
    spyEvents.mockRestore()
  })
})
