import {
  checkSession,
  getLocal,
  getSession,
  getSessionDataValue,
  removeLocal,
  setLocal,
  setSession,
  setSessionDataValue,
} from '.'
import { getSessionDataKey, getSessionIDKey } from './key'
import * as utils from '../common/utils'

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
  let spyReferrer: jest.SpyInstance<string, []>

  afterAll(() => {
    spyReferrer.mockRestore()
  })

  it('session exists and referrer is not set', () => {
    setSession('_trendsId', 'asdf0234kr23rk23rk2')
    const result = checkSession()
    expect(result).toBeFalsy()
  })

  it('session exists and referrer is set and is the same', () => {
    spyReferrer = jest
      .spyOn(utils, 'getReferrer')
      .mockImplementation(() => 'page.com')
    setSession('_trendsId', 'asdf0234kr23rk23rk2')
    setSessionDataValue('referrer', 'page.com')
    const result = checkSession()
    expect(result).toBeFalsy()
    spyReferrer.mockReset()
  })

  it('session exists and referrer is set and is different', () => {
    spyReferrer = jest
      .spyOn(utils, 'getReferrer')
      .mockImplementation(() => 'diff-page.com')
    setSession('_trendsId', 'asdf0234kr23rk23rk2')
    setSessionDataValue('referrer', 'page.com')
    const result = checkSession()
    expect(result).toBeTruthy()
    spyReferrer.mockReset()
  })

  it('new session', () => {
    spyReferrer = jest
      .spyOn(utils, 'getReferrer')
      .mockImplementation(() => 'page.com')
    const result = checkSession()
    expect(result).toBeTruthy()
    expect(getSession(getSessionIDKey())).toMatch('1580775120000')
    expect(getSession(getSessionDataKey())).toStrictEqual(
      JSON.stringify({
        referrer: 'page.com',
        search: null,
      })
    )
    spyReferrer.mockReset()
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
