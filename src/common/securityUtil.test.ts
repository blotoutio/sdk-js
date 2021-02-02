import { SHA256Encode } from './securityUtil'

describe('SHA256Encode', () => {
  it('empty', () => {
    const result = SHA256Encode('')
    expect(result).toBe('')
  })

  it('data', () => {
    const result = SHA256Encode('test string')
    expect(result).toBe(
      'd5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    )
  })
})
