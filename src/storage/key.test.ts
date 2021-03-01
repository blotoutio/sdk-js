import {
  getCreatedKey,
  getSessionDataKey,
  getSessionIDKey,
  getUIDKey,
  getUserIndexKey,
  setRootKey,
} from './key'

beforeEach(() => {
  setRootKey()
})

describe('getUserIndexKey', () => {
  it('use default', () => {
    const result = getUserIndexKey()
    expect(result).toBe('_trendsIndex')
  })

  it('custom root key', () => {
    setRootKey('Test')
    const result = getUserIndexKey()
    expect(result).toBe('TestIndex')
  })
})

describe('setRootKey', () => {
  it('null', () => {
    setRootKey()
    const result = getUserIndexKey()
    expect(result).toBe('_trendsIndex')
  })

  it('ok', () => {
    setRootKey('Test')
    const result = getUserIndexKey()
    expect(result).toBe('TestIndex')
  })
})

describe('getUIDKey', () => {
  it('ok', () => {
    const result = getUIDKey()
    expect(result).toBe('_trendsUser')
  })
})

describe('getCreatedKey', () => {
  it('ok', () => {
    const result = getCreatedKey()
    expect(result).toBe('_trendsCreated')
  })
})

describe('getSessionIDKey', () => {
  it('ok', () => {
    const result = getSessionIDKey()
    expect(result).toBe('_trendsId')
  })
})

describe('getSessionDataKey', () => {
  it('ok', () => {
    const result = getSessionDataKey()
    expect(result).toBe('_trendsData')
  })
})
