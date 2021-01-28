import { getLocal, getSession, setLocal, setSession } from '.'

describe('setLocal/getLocal', () => {
  it('null', () => {
    setLocal('', JSON.stringify({ data: 'test' }))
    const result = getLocal('')
    expect(result).toBeNull()
  })

  it('data', () => {
    const data = JSON.stringify({ data: 'test' })
    setLocal('key', data)
    const result = getLocal('key')
    expect(result).toBe(data)
  })
})

describe('setSession/getSession', () => {
  it('null', () => {
    setSession('', JSON.stringify({ data: 'test' }))
    const result = getSession('')
    expect(result).toBeNull()
  })

  it('data', () => {
    const data = JSON.stringify({ data: 'test' })
    setSession('key', data)
    const result = getSession('key')
    expect(result).toBe(data)
  })
})
