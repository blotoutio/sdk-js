import {
  create,
  setDailyActiveUsage,
  setWeeklyActiveUsage,
  setMonthlyActiveUsage
} from '.'
import * as utils from './utils'
import * as storageUtil from '../common/storageUtil'
import * as daily from './dailyActive'
import * as weekly from './weeklyActive'
import * as monthly from './monthlyActive'

describe('create', () => {
  it('ok', () => {
    const sdk = {
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
    }
    const spy = jest
      .spyOn(utils, 'getRetentionSDK')
      .mockImplementation(() => sdk)
    const result = create()
    expect(result).toStrictEqual({
      isSynced: false,
      retentionSDK: sdk
    })
    spy.mockRestore()
  })
})

describe('setDailyActiveUsage', () => {
  it('normal', () => {
    const spyCount = jest
      .spyOn(daily, 'setCount')
    const spySession = jest
      .spyOn(daily, 'setCount')
    setDailyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('dau', 41001)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest
      .spyOn(daily, 'setCount')
    const spySession = jest
      .spyOn(daily, 'setSession')
    const spyLocale = jest
      .spyOn(storageUtil, 'getLocalData')
      .mockImplementation(() => true)
    setDailyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('dau', 41001)
    expect(spyCount).toHaveBeenCalledWith('dpu', 41004)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
    spyLocale.mockRestore()
  })
})

describe('setWeeklyActiveUsage', () => {
  it('normal', () => {
    const spyCount = jest
      .spyOn(weekly, 'setCount')
    const spySession = jest
      .spyOn(weekly, 'setSession')
    setWeeklyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('wau', 41002)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest
      .spyOn(weekly, 'setCount')
    const spySession = jest
      .spyOn(weekly, 'setSession')
    const spyLocale = jest
      .spyOn(storageUtil, 'getLocalData')
      .mockImplementation(() => true)
    setWeeklyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('wau', 41002)
    expect(spyCount).toHaveBeenCalledWith('wpu', 41005)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
    spyLocale.mockRestore()
  })
})

describe('setMonthlyActiveUsage', () => {
  it('normal', () => {
    const spyCount = jest
      .spyOn(monthly, 'setCount')
    const spySession = jest
      .spyOn(monthly, 'setSession')
    setMonthlyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('mau', 41003)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest
      .spyOn(monthly, 'setCount')
    const spySession = jest
      .spyOn(monthly, 'setSession')
    const spyLocale = jest
      .spyOn(storageUtil, 'getLocalData')
      .mockImplementation(() => true)
    setMonthlyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('mau', 41003)
    expect(spyCount).toHaveBeenCalledWith('mpu', 41006)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
    spyLocale.mockRestore()
  })
})
