import {
  getBrowser
} from './utils'

describe('getBrowser', () => {
  it('browserDetails', () => {
    const result = getBrowser('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36')
    expect(result).toStrictEqual({
      name: 'Chrome',
      version: '87'
    })
  })

  it('unknown', () => {
    const result = getBrowser('')
    expect(result).toStrictEqual({
      name: 'unknown',
      version: '0.0.0.0'
    })
  })
})
