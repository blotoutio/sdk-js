import { SHA256Encode, encryptRSA, shouldEncrypt } from './securityUtil'
import { setLocal } from '../storage'
import { getUserIndexKey } from '../storage/key'

beforeEach(() => {
  setLocal(getUserIndexKey(), 'test_index')
})

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

describe('encryptRSA', () => {
  it('key is missing', () => {
    const result = encryptRSA()
    expect(result).toStrictEqual({
      data: '',
      iv: '',
      key: '',
    })
  })

  it('success', () => {
    const result = encryptRSA(
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ8GeBqADb2gj/rAAh5NlY7UM6hXF3vuyxI4bhlHMrjXGnSiwR1K4LozDgYlPKLJe/m/TP7ghzTe59hMnZWxbOKo5rZP+ndreI0vm5JuQ85ebpzvQ6xLSbNd98eZl/nTQLYQR9vr9FplMTM/D6UqFg7cnBZMCUNQyeKSDvRGNaPwIDAQAB',
      'some data'
    )
    expect(result.iv.length).toBe(32)
    expect(result.key.length).toBe(172)
    expect(result.data.length).toBe(24)
  })
})

describe('shouldEncrypt', () => {
  it('ok', () => {
    const result = shouldEncrypt()
    expect(result).toBe(true)
  })
})
