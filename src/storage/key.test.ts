import { getUserIndexKey, setRootKey } from './key'

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
