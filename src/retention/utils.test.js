import {
  getTimestampFromKey,
  getUserObject,
  getRetentionSDK,
  getHighestTimestamp,
  getLastNextDayEvent,
  getSessionTotalDuration,
  getSessionAvgObject,
  retentionWrapper
} from './utils'
import * as commonUtils from '../utils'
import * as retentionStorage from './storage'
import * as eventStorage from '../event/storage'

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

describe('getTimestampFromKey', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('empty', () => {
    const result = getTimestampFromKey()
    expect(result).toBe(null)
  })

  it('null', () => {
    const result = getTimestampFromKey(null)
    expect(result).toBe(null)
  })

  it('wrong format', () => {
    const result = getTimestampFromKey('5-14-12-2020')
    expect(result).toBe(null)
  })

  it('with key', () => {
    const result = getTimestampFromKey('15-10-2020')
    expect(result).toBe(1602720000000)
  })

  it('no leading 0', () => {
    const result = getTimestampFromKey('1-4-2020')
    expect(result).toBe(1585699200000)
  })

  it('from function', () => {
    const result = getTimestampFromKey(commonUtils.getDate())
    expect(result).toBe(1607904000000)
  })
})

describe('getUserObject', () => {
  it('null', () => {
    const result = getUserObject()
    expect(result).toStrictEqual({
      sentToServer: false,
      tstmp: 1607904720000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      nmo: 1,
      evc: 40001
    })
  })

  it('with data', () => {
    const result = getUserObject(10303)
    expect(result).toStrictEqual({
      sentToServer: false,
      tstmp: 1607904720000,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      nmo: 1,
      evc: 40001,
      evcs: 10303
    })
  })
})

describe('getRetentionSDK', () => {
  it('ok', () => {
    const spy = jest
      .spyOn(commonUtils, 'getDomain')
      .mockImplementation(() => 'blotout.io')

    const result = getRetentionSDK()
    expect(result).toStrictEqual({
      createdDate: '14-12-2020',
      modifiedDate: '14-12-2020',
      domain: 'blotout.io',
      retentionData: {
        isNewUser: {
          sentToServer: false,
          tstmp: 1607904720000,
          mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
          newUser: false,
          nmo: 1,
          evc: 40001,
          evcs: 41009
        },
        dau: [],
        dast: [],
        dpu: [],
        wau: [],
        wast: [],
        wpu: [],
        mau: [],
        mast: [],
        mpu: []
      }
    })
    spy.mockRestore()
  })
})

describe('getHighestTimestamp', () => {
  it('null values', () => {
    const retentions = [
      {
        name: 'log1',
        tstmp: 20
      },
      {
        name: 'log2'
      },
      {
        name: 'log3',
        tstmp: 10
      }
    ]
    const result = getHighestTimestamp(retentions)
    expect(result).toBe(20)
  })

  it('all values', () => {
    const retentions = [
      {
        name: 'log1',
        tstmp: 20
      },
      {
        name: 'log2',
        tstmp: 30
      },
      {
        name: 'log3',
        tstmp: 10
      }
    ]
    const result = getHighestTimestamp(retentions)
    expect(result).toBe(30)
  })
})

describe('getLastNextDayEvent', () => {
  it('null store', () => {
    const spy = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => null)

    const result = getLastNextDayEvent()
    expect(result).toStrictEqual({
      eventKey: '',
      eventStamp: 0
    })
    spy.mockRestore()
  })

  it('null timestamp', () => {
    const spy = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => ({
        '10-05-2020': {}
      }))

    const result = getLastNextDayEvent()
    expect(result).toStrictEqual({
      eventKey: '',
      eventStamp: 0
    })
    spy.mockRestore()
  })

  it('dec 13st last log, current dec 14th', () => {
    const spy = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => ({
        '13-12-2020': {}
      }))

    const result = getLastNextDayEvent(1607821200000)
    expect(result).toStrictEqual({
      eventKey: '',
      eventStamp: 0
    })
    spy.mockRestore()
  })

  it('dec 11st last log, current dec 14th', () => {
    const spy = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => ({
        '11-12-2020': {},
        '12-12-2020': {},
        '13-12-2020': {}
      }))

    const result = getLastNextDayEvent(1607648400000)
    expect(result).toStrictEqual({
      eventKey: '12-12-2020',
      eventStamp: 1607731200000
    })
    spy.mockRestore()
  })

  it('dec 12st last log, current dec 14th', () => {
    const spy = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => ({
        '12-12-2020': {},
        '13-12-2020': {}
      }))

    const result = getLastNextDayEvent(1607734800000)
    expect(result).toStrictEqual({
      eventKey: '13-12-2020',
      eventStamp: 1607817600000
    })
    spy.mockRestore()
  })
})

describe('getSessionTotalDuration', () => {
  it('null value', () => {
    const result = getSessionTotalDuration(null)
    expect(result).toBe(0)
  })

  it('empty value', () => {
    const result = getSessionTotalDuration()
    expect(result).toBe(0)
  })

  it('null session value', () => {
    const result = getSessionTotalDuration({
      120391034203: {
        startTime: 10,
        endTime: 30
      },
      120391031203: undefined
    })
    expect(result).toBe(20)
  })

  it('ok sessions', () => {
    const result = getSessionTotalDuration({
      120391031203: {
        startTime: 10,
        endTime: 20
      },
      120391034203: {
        startTime: 10,
        endTime: 60
      },
      120331031203: {
        startTime: 10,
        endTime: 30
      }
    })
    expect(result).toBe(80)
  })
})

describe('getSessionAvgObject', () => {
  it('null values', () => {
    const result = getSessionAvgObject()
    expect(result).toStrictEqual({
      sentToServer: false,
      logtstmp: 1607904720000,
      nmo: 1,
      evc: 40001,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423'
    })
  })

  it('ok values', () => {
    const result = getSessionAvgObject(10303, 1607727600000, 10)
    expect(result).toStrictEqual({
      sentToServer: false,
      logtstmp: 1607904720000,
      nmo: 1,
      evc: 40001,
      mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
      evcs: 10303,
      tstmp: 1607727600000,
      avgtime: 10
    })
  })
})

describe('retentionWrapper', () => {
  it('null values', () => {
    const spySet = jest.spyOn(retentionStorage, 'setSDK')
      .mockImplementation()
    retentionWrapper()
    expect(spySet).toHaveBeenCalledTimes(0)
    spySet.mockRestore()
  })

  it('empty storage', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getSDK')
      .mockImplementation(() => null)

    const spySet = jest.spyOn(retentionStorage, 'setSDK')
      .mockImplementation()
    retentionWrapper('dau', () => {})
    expect(spySet).toHaveBeenCalledTimes(0)
    spySet.mockRestore()
    spyGet.mockRestore()
  })

  it('empty retentionData', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getSDK')
      .mockImplementation(() => ({ }))

    const spySet = jest.spyOn(retentionStorage, 'setSDK')
      .mockImplementation()
    retentionWrapper('dau', () => {})
    expect(spySet).toHaveBeenCalledTimes(0)
    spySet.mockRestore()
    spyGet.mockRestore()
  })

  it('key not defined in storage', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getSDK')
      .mockImplementation(() => ({
        retentionData: {}
      }))

    const spySet = jest.spyOn(retentionStorage, 'setSDK')
      .mockImplementation()
    retentionWrapper('dau', () => {})
    expect(spySet).toHaveBeenCalledTimes(0)
    spySet.mockRestore()
    spyGet.mockRestore()
  })

  it('ok', () => {
    const spyGet = jest
      .spyOn(retentionStorage, 'getSDK')
      .mockImplementation(() => ({
        retentionData: {
          dau: []
        }
      }))

    const spySet = jest.spyOn(retentionStorage, 'setSDK')
      .mockImplementation()
    retentionWrapper('dau', (retentions) => {
      retentions.push({
        evc: 40001,
        evcs: 41001,
        mid: 'blotout.io-aosdfkaosfkoaskfo23e23-23423423423',
        nmo: 1,
        sentToServer: false,
        tstmp: 1637904720000
      })
      return retentions
    })
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
          }
        ]
      }
    })
    spySet.mockRestore()
    spyGet.mockRestore()
  })
})
