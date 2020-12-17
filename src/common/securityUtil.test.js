import {
  SHA256Encode,
  decryptAES,
  encryptAES,
  encryptRSA,
  SHA1Encode,
  shouldEncrypt
} from './securityUtil'
import { getRootIndexKey } from '../utils'
import AES from 'crypto-js/aes'
import { setLocal } from '../storage'

beforeEach(() => {
  setLocal(getRootIndexKey(), 'test_index')
})

describe('SHA256Encode', () => {
  it('empty', () => {
    const result = SHA256Encode('')
    expect(result).toBe('')
  })

  it('data', () => {
    const result = SHA256Encode('test string')
    expect(result).toBe('d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b')
  })
})

describe('SHA1Encode', () => {
  it('empty', () => {
    const result = SHA1Encode('')
    expect(result).toBe('')
  })

  it('data', () => {
    const result = SHA1Encode('test string')
    expect(result).toBe('661295c9cbf9d6b2f6428414504a8deed3020641')
  })
})

describe('encryptAES', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('empty pass code', () => {
    const result = encryptAES('test string', '')
    expect(result).toStrictEqual({
      encryptedString: 'TRD/UpQ64IRCO6kYlWTtQw==',
      iv: '71ff5f79a75f6f5d3d6f9e3d6f46b76f',
      key: 'de089061213cb834e8c1fdf7727a64f9fdcd46775ab00a76d360d0b0ab1b5495'
    })
  })

  it('short pass code', () => {
    const result = encryptAES('test string', 'mypass')
    expect(result).toStrictEqual({
      encryptedString: 'TRD/UpQ64IRCO6kYlWTtQw==',
      iv: '71ff5f79a75f6f5d3d6f9e3d6f46b76f',
      key: 'de089061213cb834e8c1fdf7727a64f9fdcd46775ab00a76d360d0b0ab1b5495'
    })
  })

  it('long pas code', () => {
    const result = encryptAES(
      'test string',
      'verystrongthingthoksdfoksdfoksdhfverystrongthingthoksdfoksdfoksdhf')
    expect(result).toStrictEqual({
      encryptedString: 'b0METN8v1HtFgepaF/4QpA==',
      iv: 'a2782d8629e0b61a24b1d7e892c75fa2',
      key: 'aed04f8c19d0ebc675a8bf92be5b77c384aa8e64d756a4bb29ff82cf38b427a3'
    })
  })

  it('root index is empty', () => {
    setLocal(getRootIndexKey(), '')
    const result = encryptAES('test string')
    expect(result).toStrictEqual({
      encryptedString: '',
      iv: '',
      key: ''
    })
  })

  it('encrypt failed', () => {
    const spy = jest
      .spyOn(AES, 'encrypt')
      .mockImplementation(() => null)
    const result = encryptAES('test string')
    expect(result).toStrictEqual({
      encryptedString: '',
      iv: '',
      key: ''
    })
    spy.mockRestore()
  })
})

describe('decryptAES', () => {
  it('empty pass code', () => {
    const result = decryptAES('TRD/UpQ64IRCO6kYlWTtQw==', '')
    expect(result).toBe('test string')
  })

  it('short pass code', () => {
    const result = decryptAES('TRD/UpQ64IRCO6kYlWTtQw==', 'mypass')
    expect(result).toBe('test string')
  })

  it('long pas code', () => {
    const result = decryptAES(
      'b0METN8v1HtFgepaF/4QpA==',
      'verystrongthingthoksdfoksdfoksdhfverystrongthingthoksdfoksdfoksdhf')
    expect(result).toBe('test string')
  })

  it('root index is empty', () => {
    setLocal(getRootIndexKey(), '')
    const result = decryptAES('b0METN8v1HtFgepaF/4QpA==')
    expect(result).toBe('')
  })

  it('decryption failed', () => {
    const spy = jest
      .spyOn(AES, 'decrypt')
      .mockImplementation(() => {
        return 1 / 0
      })
    const result = decryptAES('b0METN8v1HtFgepaF/4QpA==')
    expect(result).toBe('')
    spy.mockRestore()
  })
})

describe('encryptRSA', () => {
  it('key is missing', () => {
    const result = encryptRSA()
    expect(result).toStrictEqual({
      data: '',
      iv: '',
      key: ''
    })
  })

  it('success', () => {
    const result = encryptRSA('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ8GeBqADb2gj/rAAh5NlY7UM6hXF3vuyxI4bhlHMrjXGnSiwR1K4LozDgYlPKLJe/m/TP7ghzTe59hMnZWxbOKo5rZP+ndreI0vm5JuQ85ebpzvQ6xLSbNd98eZl/nTQLYQR9vr9FplMTM/D6UqFg7cnBZMCUNQyeKSDvRGNaPwIDAQAB', 'some data')
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
