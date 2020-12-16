import * as retentionStorage from '../storage/retention'
import * as eventStorage from '../storage/event'
import * as commonUtils from '../utils'
import { setCount, setSession } from './monthlyActive'

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
  it('empty mau', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mau: []
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setCount('mau', 41003)
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        mau: [
          {
            evc: 40001,
            evcs: 41003,
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
          mau: [
            {
              evc: 40001,
              evcs: 41003,
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

    setCount('mau', 41003)
    expect(spySet).toHaveBeenCalledTimes(0)
    spyGet.mockRestore()
    spySet.mockRestore()
  })

  it('already exists, different timestamp', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mau: [
            {
              evc: 40001,
              evcs: 41003,
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

    setCount('mau', 41003)
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        mau: [
          {
            evc: 40001,
            evcs: 41003,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1637904720000
          },
          {
            evc: 40001,
            evcs: 41003,
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
  it('event store null', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsStore')
      .mockImplementation(() => null)

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
    spyEvents.mockRestore()
  })

  it('event data is null', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsStore')
      .mockImplementation(() => ({
        '9-12-2020': {}
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
    spyEvents.mockRestore()
  })

  it('current month is the highest in retention', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: [
            {
              tstmp: 1608016191253
            }
          ]
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
  })

  it('current month is not the highest in retention', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: [
            {
              tstmp: 1308016191253
            }
          ]
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledTimes(0)
    spyRetention.mockRestore()
  })

  it('current month is the not there yet', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: []
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsStore')
      .mockImplementation(() => ({
        '9-11-2020': {
          sdkData: {
            sessions: {
              1607952235992: {
                startTime: 1308016181253,
                endTime: 1308016191253
              },
              1607952235234992: {
                startTime: 1308016191253,
                endTime: 1308016192253
              }
            }
          }
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        mast: [
          {
            avgtime: 5500,
            evc: 40001,
            evcs: 41012,
            logtstmp: 1607904720000,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1607952235992
          }
        ]
      }
    })
    spyRetention.mockRestore()
    spyEvents.mockRestore()
  })

  it('retention is there, but not for current month and events are old', () => {
    const spyRetention = jest
      .spyOn(retentionStorage, 'getRetentionSDKData')
      .mockImplementation(() => ({
        retentionData: {
          mast: [
            {
              tstmp: 1208016191253
            }
          ]
        }
      }))

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsStore')
      .mockImplementation(() => ({
        '9-11-2020': {
          sdkData: {
            sessions: {
              1607952235992: {
                startTime: 1308016181253,
                endTime: 1308016191253
              },
              1607952235234992: {
                startTime: 1308016191253,
                endTime: 1308016192253
              }
            }
          }
        },
        '15-12-2020': {
          sdkData: {
            sessions: {}
          }
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setRetentionSDKData')
      .mockImplementation()

    setSession()
    expect(spySet).toHaveBeenCalledWith({
      retentionData: {
        mast: [
          {
            tstmp: 1208016191253
          },
          {
            avgtime: 5500,
            evc: 40001,
            evcs: 41012,
            logtstmp: 1607904720000,
            mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
            nmo: 1,
            sentToServer: false,
            tstmp: 1607952235992
          }
        ]
      }
    })
    spyRetention.mockRestore()
    spyEvents.mockRestore()
  })
})
