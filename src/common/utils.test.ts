import {
  debounce,
  getMid,
  getReferrer,
  getSearchParams,
  setCreateTimestamp,
} from './utils'
import * as uidUtil from './uidUtil'
import { getLocal, removeLocal } from '../storage'
import { getCreatedKey } from '../storage/key'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('getMid', () => {
  it('ok', () => {
    const spy = jest
      .spyOn(uidUtil, 'getUID')
      .mockImplementation(() => 'er2r23r2r23r')
    expect(getMid()).toEqual('localhost-er2r23r2r23r-1580775120000')
    spy.mockRestore()
  })
})

describe('debounce', () => {
  it('ok', () => {
    const callback = jest.fn()

    const func = debounce(callback, 500)
    func()
    func()
    func()
    jest.runAllTimers()
    expect(callback).toBeCalledTimes(1)
  })
})

describe('getReferrer', () => {
  it('not set', () => {
    expect(getReferrer()).toBeNull()
  })

  it('referrer is same as window', () => {
    const windowSpy = jest.spyOn(global, 'window', 'get')
    const originalWindow = { ...window }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      location: {
        ...originalWindow.location,
        host: 'domain.com',
      },
    }))
    Object.defineProperty(document, 'referrer', {
      value: 'https://domain.com',
      configurable: true,
    })
    expect(getReferrer()).toBeNull()
    windowSpy.mockRestore()
  })

  it('referrer is not url', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'localhost',
      configurable: true,
    })
    expect(getReferrer()).toBeNull()
  })

  it('referrer is different then window', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://google.com',
      configurable: true,
    })
    expect(getReferrer()).toEqual('https://google.com/')
  })
})

describe('getSearchParams', () => {
  it('null', () => {
    expect(getSearchParams()).toBeNull()
  })

  it('ok', () => {
    const windowSpy = jest.spyOn(global, 'window', 'get')
    const originalWindow = { ...window }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      location: {
        ...originalWindow.location,
        search: '?key1=value1&key2=value2&key3=1',
      },
    }))

    expect(getSearchParams()).toStrictEqual({
      key1: 'value1',
      key2: 'value2',
      key3: '1',
    })
    windowSpy.mockRestore()
  })
})

describe('setCreateTimestamp', () => {
  beforeEach(() => {
    removeLocal(getCreatedKey())
  })

  it('old user', () => {
    setCreateTimestamp(false)
    expect(getLocal(getCreatedKey())).toBeNull()
  })

  it('new user', () => {
    setCreateTimestamp(true)
    expect(getLocal(getCreatedKey())).toEqual('1580775120000')
  })
})
