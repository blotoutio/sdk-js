import { constants } from '../config'

import * as dailyActive from './dailyActive'
import * as weeklyActive from './weeklyActive'
import * as monthlyActive from './monthlyActive'
import { getLocal } from '../storage'

export const setDailyActiveUsage = () => {
  dailyActive.setCount('dau', constants.DAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    dailyActive.setCount('dpu', constants.DPUCode)
  }
  dailyActive.setSession()
}

export const setWeeklyActiveUsage = () => {
  weeklyActive.setCount('wau', constants.WAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    weeklyActive.setCount('wpu', constants.WPUCode)
  }
  weeklyActive.setSession()
}

export const setMonthlyActiveUsage = () => {
  monthlyActive.setCount('mau', constants.MAUCode)
  const isPayingUser = getLocal(constants.IS_PAYING_USER)
  if (isPayingUser) {
    monthlyActive.setCount('mpu', constants.MPUCode)
  }
  monthlyActive.setSession()
}
