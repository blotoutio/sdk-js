import { stringToIntSum } from './securityUtil'

describe('stringToIntSum', () => {
  it('empty', () => {
    const result = stringToIntSum('')
    expect(result).toBe(0)
  })

  it('data', () => {
    const result = stringToIntSum('test string')
    expect(result).toBe(2658)
  })
})
