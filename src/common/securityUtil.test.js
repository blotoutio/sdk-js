import { MD5Encode, SHA256Encode, decryptAES, encryptAES } from './securityUtil'
import { setLocalData } from './storageUtil'
import { getRootIndexKey } from '../utils'

setLocalData(getRootIndexKey(), 'test_index')

describe('MD5Encode', () => {
  it('empty', () => {
    const result = MD5Encode('')
    expect(result).toBe('')
  })

  it('data', () => {
    const result = MD5Encode('test string')
    expect(result).toBe('6f8db599de986fab7a21625b7916589c')
  })
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

describe('encryptAES', () => {
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
})
