import * as storage from '.'
import * as utils from '../utils'
import {
  getCustomUseValue,
  getNormalUseValue,
  getTempUseValue,
  setCustomUseValue,
  setNormalUseValue,
  setTempUseValue
} from './sharedPreferences'
import { updateRoot } from './store'

describe('getTempUseValue', () => {
  it('null', () => {
    const result = getTempUseValue()
    expect(result).toBe(null)
  })

  it('key is not present', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          tempUse: {
            data: true
          }
        }
      }))

    const result = getTempUseValue('foo')
    expect(result).toStrictEqual(undefined)
    spyGet.mockRestore()
  })

  it('ok', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          tempUse: {
            data: true
          }
        }
      }))

    const result = getTempUseValue('data')
    expect(result).toBe(true)
    spyGet.mockRestore()
  })
})

describe('setTempUseValue', () => {
  it('null', () => {
    setTempUseValue()
  })

  it('tempUse not present', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {}
      }
    }
    updateRoot(obj)

    setTempUseValue('data', true)
    const result = getTempUseValue('data')
    expect(result).toBe(null)
    spyDomain.mockRestore()
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {
          tempUse: {}
        }
      }
    }
    updateRoot(obj)

    setTempUseValue('data', true)
    const result = getTempUseValue('data')
    expect(result).toBe(true)
    spyDomain.mockRestore()
  })
})

describe('getNormalUseValue', () => {
  it('null', () => {
    const result = getNormalUseValue()
    expect(result).toBe(null)
  })

  it('key is not present', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          normalUse: {
            data: true
          }
        }
      }))

    const result = getNormalUseValue('foo')
    expect(result).toStrictEqual(undefined)
    spyGet.mockRestore()
  })

  it('ok', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          normalUse: {
            data: true
          }
        }
      }))

    const result = getNormalUseValue('data')
    expect(result).toBe(true)
    spyGet.mockRestore()
  })
})

describe('setNormalUseValue', () => {
  it('null', () => {
    setNormalUseValue()
  })

  it('normalUse not present', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {}
      }
    }
    updateRoot(obj)

    setNormalUseValue('data', true)
    const result = getNormalUseValue('data')
    expect(result).toBe(null)
    spyDomain.mockRestore()
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {
          normalUse: {}
        }
      }
    }
    updateRoot(obj)

    setNormalUseValue('data', true)
    const result = getNormalUseValue('data')
    expect(result).toBe(true)
    spyDomain.mockRestore()
  })
})

describe('getCustomUseValue', () => {
  it('null', () => {
    const result = getCustomUseValue()
    expect(result).toBe(null)
  })

  it('key is not present', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          customUse: {
            data: true
          }
        }
      }))

    const result = getCustomUseValue('foo')
    expect(result).toStrictEqual(undefined)
    spyGet.mockRestore()
  })

  it('ok', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        sharedPreference: {
          customUse: {
            data: true
          }
        }
      }))

    const result = getCustomUseValue('data')
    expect(result).toBe(true)
    spyGet.mockRestore()
  })
})

describe('setCustomUseValue', () => {
  it('null', () => {
    setCustomUseValue()
  })

  it('customUse not present', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {}
      }
    }
    updateRoot(obj)

    setCustomUseValue('data', true)
    const result = getCustomUseValue('data')
    expect(result).toBe(null)
    spyDomain.mockRestore()
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        sharedPreference: {
          customUse: {}
        }
      }
    }
    updateRoot(obj)

    setCustomUseValue('data', true)
    const result = getCustomUseValue('data')
    expect(result).toBe(true)
    spyDomain.mockRestore()
  })
})