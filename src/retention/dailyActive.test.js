import * as retentionStorage from '../storage/retention'
import * as eventStorage from '../storage/event'
import * as commonUtils from '../utils'
import * as utils from './utils'
import { setCount, setSession } from './dailyActive'

let spyGetUserObject
beforeEach(() => {
  spyGetUserObject = jest
    .spyOn(commonUtils, 'getMid')
    .mockImplementation(() => 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423')

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('14 Dec 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spyGetUserObject.mockRestore()
  jest.useRealTimers()
})

describe('setCount', () => {
  it('empty dau', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dau: []
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setCount('dau', 41001)
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        dau: [
          {
            evc: 40001,
            evcs: 41001,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1607904720000
          }
        ]
      }
    })
    spyGet.mockRestore()
    spySet.mockRestore()
  })

  it('already exists, same timestamp', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dau: [
            {
              evc: 40001,
              evcs: 41001,
              mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
              nmo: 1,
              sentToServer: false,
              tstmp: 1607904720000
            }
          ]
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setCount('dau', 41001)
    expect(spySet).toHaveBeenCalledTimes(0)
    spyGet.mockRestore()
    spySet.mockRestore()
  })

  it('already exists, different timestamp', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dau: [
            {
              evc: 40001,
              evcs: 41001,
              mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
              nmo: 1,
              sentToServer: false,
              tstmp: 1637904720000
            }
          ]
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setCount('dau', 41001)
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        dau: [
          {
            evc: 40001,
            evcs: 41001,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1637904720000
          },
          {
            evc: 40001,
            evcs: 41001,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1607904720000
          }
        ]
      }
    })
    spyGet.mockRestore()
    spySet.mockRestore()
  })
})

describe('setSession', () => {
  it('event sessions null', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
    spyEvents.mockRestore()
  })

  it('event sessions null', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)

    const spyLast = jest
      .spyOn(utils, 'getLastNextDayEvent')
      .mockImplementation(() => ({
        eventKey: '13-12-2020',
        eventStamp: 1607814000000
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
    spyEvents.mockRestore()
    spyLast.mockRestore()
  })

  it('event sessions empty', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))

    const spyLast = jest
      .spyOn(utils, 'getLastNextDayEvent')
      .mockImplementation(() => ({
        eventKey: '13-12-2020',
        eventStamp: 1607814000000
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
    spyEvents.mockRestore()
    spyLast.mockRestore()
  })

  it('ok', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          dast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          1607952235992: {
            startTime: 1607952235995,
            endTime: 1607952251412
          },
          1607952245992: {
            startTime: 1607952245994,
            endTime: 1607952246994
          }
        }
      }))

    const spyLast = jest
      .spyOn(utils, 'getLastNextDayEvent')
      .mockImplementation(() => ({
        eventKey: '13-12-2020',
        eventStamp: 1607814000000
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        dast: [
          {
            avgtime: 8208.5,
            evc: 40001,
            evcs: 41010,
            logtstmp: 1607904720000,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1607814000000

          }
        ]
      }
    })
    spyRetention.mockRestore()
    spyEvents.mockRestore()
    spyLast.mockRestore()
  })
})
