import {
  checkSession,
  getLocal,
  getSession,
  getSessionDataValue,
  getSessionID,
  removeLocal,
  setLocal,
  setSession,
  setSessionDataValue,
} from './index'
import { getSessionDataKey, getSessionIDKey } from './key'

beforeEach(() => {
  window.sessionStorage.removeItem(getSessionIDKey())
  window.sessionStorage.removeItem(getSessionDataKey())

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

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

describe('removeLocal', () => {
  it('null', () => {
    removeLocal('')
  })

  it('ok', () => {
    setLocal('key', 'test')
    removeLocal('key')
    const result = getLocal('key')
    expect(result).toBeNull()
  })
})

describe('checkSession', () => {
  it('session exists', () => {
    setSession('_trendsId', 'asdf0234kr23rk23rk2')
    const result = checkSession()
    expect(result).toBeFalsy()
  })

  it('new session', () => {
    const result = checkSession()
    expect(result).toBeTruthy()
  })
})

describe('getSessionDataValue', () => {
  it('error', () => {
    setSession(getSessionDataKey(), 'fsdfok]')
    const result = getSessionDataValue('manifest')
    expect(result).toBeNull()
  })

  it('ok', () => {
    setSession(getSessionDataKey(), JSON.stringify({ referrer: 'page.com' }))
    const result = getSessionDataValue('referrer')
    expect(result).toMatch('page.com')
  })
})

describe('setSessionDataValue', () => {
  it('error', () => {
    setSession(getSessionDataKey(), 'fsdfok]')
    const result = setSessionDataValue('manifest', { data: true })
    expect(result).toBeUndefined()
  })

  it('ok', () => {
    setSession(
      getSessionDataKey(),
      JSON.stringify({ referrer: 'diff-page.com' })
    )
    setSessionDataValue('referrer', 'page.com')
    expect(getSessionDataValue('referrer')).toMatch('page.com')
  })
})

describe('getSessionID', () => {
  it('existing session', () => {
    const sessionId = 'asdf0234kr23rk23rk2'
    setSession('_trendsId', sessionId)
    expect(getSessionID()).toBe(sessionId)
  })

  it('new session', () => {
    window.sessionStorage.clear()
    expect(getSessionID()).toBe('1580775120000')
  })
})
