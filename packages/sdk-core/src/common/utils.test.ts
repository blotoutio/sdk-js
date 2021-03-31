import {
  debounce,
  getCreateTimestamp,
  getMid,
  getReferrer,
  getSearchParams,
  setCreateTimestamp,
} from './utils'
import * as uidUtil from './uidUtil'
import { getLocal, removeLocal, setLocal } from '../storage'
import { getCreatedKey } from '../storage/key'
jest.mock('uuid', () => ({ v4: () => '43cf2386-1285-445c-8633-d7555d6e2f35' }))

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('getMid', () => {
  let spyUID: jest.SpyInstance<string>

  beforeEach(() => {
    spyUID = jest.spyOn(uidUtil, 'getUID').mockReturnValue('er2r23r2r23r')
  })

  afterEach(() => {
    spyUID.mockRestore()
  })

  it('ok', () => {
    Object.defineProperty(performance, 'now', {
      value: () => 1231231.023424234,
    })
    expect(getMid('sdk_start')).toEqual(
      'c2RrX3N0YXJ0-43cf2386-1285-445c-8633-d7555d6e2f35-1231231.0234'
    )
  })

  it('performance is not available', () => {
    Object.defineProperty(performance, 'now', {
      value: undefined,
    })

    expect(getMid('sdk_start')).toEqual(
      'c2RrX3N0YXJ0-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000'
    )
  })

  it('performance is empty', () => {
    Object.defineProperty(performance, 'now', {
      value: () => 0,
    })

    expect(getMid('sdk_start')).toEqual(
      'c2RrX3N0YXJ0-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000'
    )
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

  it('ok', () => {
    const result = setCreateTimestamp()
    expect(result).toBe(1580775120000)
    expect(getLocal(getCreatedKey())).toEqual('1580775120000')
  })
})

describe('getCreateTimestamp', () => {
  beforeEach(() => {
    removeLocal(getCreatedKey())
  })

  it('not set', () => {
    expect(getLocal(getCreatedKey())).toBe(null)
    const result = getCreateTimestamp()
    expect(result).toBe(1580775120000)
    expect(getLocal(getCreatedKey())).toEqual('1580775120000')
  })

  it('set', () => {
    setLocal(getCreatedKey(), '1580775120000')
    const result = getCreateTimestamp()
    expect(result).toBe(1580775120000)
  })
})
