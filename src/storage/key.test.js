import { getRootIndex, getRootKey, setRootKey } from './key'

beforeEach(() => {
  setRootKey()
})

describe('getRootKey', () => {
  it('use default key', () => {
    const result = getRootKey()
    expect(result).toBe('sdkRoot')
  })

  it('use custom', () => {
    setRootKey('Test')
    const result = getRootKey()
    expect(result).toBe('sdkTest')
  })
})

describe('setRootKey', () => {
  it('null', () => {
    setRootKey(null)
    const result = getRootKey()
    expect(result).toBe('sdkRoot')
  })

  it('value', () => {
    setRootKey('Test')
    const result = getRootKey()
    expect(result).toBe('sdkTest')
  })
})

describe('getRootIndex', () => {
  it('use default', () => {
    const result = getRootIndex()
    expect(result).toBe('sdkRootIndex')
  })

  it('custom root key', () => {
    setRootKey('Test')
    const result = getRootIndex()
    expect(result).toBe('sdkTestIndex')
  })
})
