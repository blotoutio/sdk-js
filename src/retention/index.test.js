import {
  setDailyActiveUsage,
  setWeeklyActiveUsage,
  setMonthlyActiveUsage,
} from '.'
import * as storage from '../storage'
import * as daily from './dailyActive'
import * as weekly from './weeklyActive'
import * as monthly from './monthlyActive'

describe('setDailyActiveUsage', () => {
  it('normal', () => {
    const spyCount = jest.spyOn(daily, 'setCount')
    const spySession = jest.spyOn(daily, 'setCount')
    setDailyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('dau', 41001)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest.spyOn(daily, 'setCount')
    const spySession = jest.spyOn(daily, 'setSession')
    const spyLocale = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation((name) => {
        if (name === 'isPayingUser') {
          return true
        }

        return null
      })
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
    const spyCount = jest.spyOn(weekly, 'setCount')
    const spySession = jest.spyOn(weekly, 'setSession')
    setWeeklyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('wau', 41002)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest.spyOn(weekly, 'setCount')
    const spySession = jest.spyOn(weekly, 'setSession')
    const spyLocale = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation((name) => {
        if (name === 'isPayingUser') {
          return true
        }

        return null
      })
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
    const spyCount = jest.spyOn(monthly, 'setCount')
    const spySession = jest.spyOn(monthly, 'setSession')
    setMonthlyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('mau', 41003)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
  })

  it('normal + paying user', () => {
    const spyCount = jest.spyOn(monthly, 'setCount')
    const spySession = jest.spyOn(monthly, 'setSession')
    const spyLocale = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation((name) => {
        if (name === 'isPayingUser') {
          return true
        }

        return null
      })
    setMonthlyActiveUsage()
    expect(spyCount).toHaveBeenCalledWith('mau', 41003)
    expect(spyCount).toHaveBeenCalledWith('mpu', 41006)
    expect(spySession).toHaveBeenCalledTimes(1)
    spyCount.mockRestore()
    spySession.mockRestore()
    spyLocale.mockRestore()
  })
})
