import { encryptRSA } from './security'
import { setLocal } from '../storage'
import { getUserIndexKey } from '../storage/key'

beforeEach(() => {
  setLocal(getUserIndexKey(), 'test_index')
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
