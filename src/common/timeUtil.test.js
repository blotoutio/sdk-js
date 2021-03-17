import {
  getWeekNumber,
  millisecondsToHours,
  getNearestTimestamp,
  millisecondsToDays,
  getMonthNumber
} from './timeUtil'

describe('millisecondsToHours', () => {
  it('empty', () => {
    const result = millisecondsToHours(0)
    expect(result).toBe('00')
  })

  it('data', () => {
    const result = millisecondsToHours(160164865100)
    expect(result).toBe('18')
  })
})

describe('millisecondsToDays', () => {
  it('empty', () => {
    const result = millisecondsToDays(0)
    expect(result).toBe(0)
  })

  it('data', () => {
    const result = millisecondsToDays(160164865100)
    expect(result).toBe(1853)
  })
})

describe('getWeekNumber', () => {
  it('data', () => {
    const result = getWeekNumber(new Date(160164865100))
    expect(result).toBe(5)
  })
})

describe('getMonthNumber', () => {
  it('data', () => {
    const result = getMonthNumber(1601648651)
    expect(result).toBe(0)
  })
})

describe('getNearestTimestamp', () => {
  it('data', () => {
    const result = getNearestTimestamp(1601648651)
    expect(result).toBe(1601649000)
  })
})
