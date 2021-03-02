import {
  getCreatedKey,
  getSessionDataKey,
  getSessionIDKey,
  getUIDKey,
  setRootKey,
} from './key'

beforeEach(() => {
  setRootKey()
})

describe('setRootKey', () => {
  it('null', () => {
    setRootKey()
    const result = getUIDKey()
    expect(result).toBe('_trendsUser')
  })

  it('ok', () => {
    setRootKey('Test')
    const result = getUIDKey()
    expect(result).toBe('TestUser')
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
