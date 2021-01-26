import {
  getWeekNumber,
  millisecondsToHours,
  millisecondsToDays,
  getMonthNumber,
  getCurrentWeekNumber,
  getCurrentMonthNumber,
  getFormattedDate,
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
  it('Oct 02 2020', () => {
    const result = getWeekNumber(new Date(1601648651000))
    expect(result).toBe(40)
  })

  it('Dec 30 2019', () => {
    const result = getWeekNumber(new Date(1577664000000))
    expect(result).toBe(1)
  })

  it('Jan 1 2020', () => {
    const result = getWeekNumber(new Date(1577880000000))
    expect(result).toBe(1)
  })

  it('Dec 29 2008', () => {
    const result = getWeekNumber(new Date(1230508800000))
    expect(result).toBe(1)
  })

  it('Jan 3 2010', () => {
    const result = getWeekNumber(new Date(1262476800000))
    expect(result).toBe(53)
  })

  it('Jan 1 2006', () => {
    const result = getWeekNumber(new Date(1136073600000))
    expect(result).toBe(52)
  })

  it('Jan 3 2010', () => {
    const result = getWeekNumber(new Date(1262476800000))
    expect(result).toBe(53)
  })
})

describe('getMonthNumber', () => {
  it('data', () => {
    const result = getMonthNumber(1601648651)
    expect(result).toBe(0)
  })
})

describe('getCurrentWeekNumber', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('Jan 1st is Wed', () => {
    jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
    const result = getCurrentWeekNumber()
    expect(result).toBe(6)
  })

  it('Jan 1st is Sat', () => {
    jest.setSystemTime(new Date('04 Feb 2011 00:12:00 GMT').getTime())
    const result = getCurrentWeekNumber()
    expect(result).toBe(5)
  })

  it('Last week of 2020', () => {
    jest.setSystemTime(new Date('30 Dec 2020 00:12:00 GMT').getTime())
    const result = getCurrentWeekNumber()
    expect(result).toBe(53)
  })
})

describe('getCurrentMonthNumber', () => {
  it('run', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
    const result = getCurrentMonthNumber()
    expect(result).toBe(1)
    jest.useRealTimers()
  })
})

describe('getFormattedDate', () => {
  it('null', () => {
    const result = getFormattedDate(null)
    expect(result).toBeNull()
  })

  it('random input', () => {
    const result = getFormattedDate('asfasdfdsf')
    expect(result).toBeNull()
  })

  it('ok', () => {
    const result = getFormattedDate(new Date('2020-03-25'))
    expect(result).toBe('03/25/20')
  })
})
