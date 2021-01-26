import {
  setDailyActiveUsage,
  setWeeklyActiveUsage,
  setMonthlyActiveUsage,
} from '.'
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
})
