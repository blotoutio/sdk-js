import * as storage from '../storage'
import * as utils from '../utils'
import {
  setData,
  getData,
  getStore,
  getModifiedDate, setCreatedDate, setModifiedDate
} from './storage'
import { updateRoot } from '../storage/store'

describe('getStore', () => {
  it('null', () => {
    const result = getStore()
    expect(result).toBe(null)
  })

  it('store present, but no events', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        test: {}
      }))
    const result = getStore()
    expect(result).toBe(undefined)
    spyDomain.mockRestore()
  })

  it('all ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          data: true
        }
      }))
    const result = getStore()
    expect(result).toStrictEqual({
      data: true
    })
    spyDomain.mockRestore()
  })
})

describe('setData', () => {
  it('null', () => {
    setData()
  })

  it('store null', () => {
    setData({
      data: false
    })
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        manifest: {}
      }
    }
    updateRoot(obj)

    setData({
      data: false
    })
    const result = getData()
    expect(result).toStrictEqual({
      data: false
    })
    spyDomain.mockRestore()
  })
})

describe('getData', () => {
  it('null', () => {
    const result = getData()
    expect(result).toBe(null)
  })

  it('ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          manifestData: {
            data: true
          }
        }
      }))
    const result = getData()
    expect(result).toStrictEqual({
      data: true
    })
    spyDomain.mockRestore()
  })
})

describe('getModifiedDate', () => {
  it('null', () => {
    const result = getModifiedDate()
    expect(result).toBe(null)
  })

  it('ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          modifiedDate: 43513245235
        }
      }))
    const result = getModifiedDate()
    expect(result).toBe(43513245235)
    spyDomain.mockRestore()
  })
})

describe('setModifiedDate', () => {
  it('null', () => {
    setModifiedDate()
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        manifest: {}
      }
    }
    updateRoot(obj)
    setModifiedDate(3241241234234)
    const result = getModifiedDate()
    expect(result).toBe(3241241234234)
    spyDomain.mockRestore()
  })
})

describe('setCreatedDate', () => {
  it('null', () => {
    setCreatedDate()
  })

  it('created date is already present', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        manifest: {
          createdDate: 12312312312312
        }
      }
    }
    updateRoot(obj)
    setCreatedDate(234234234)
    const result = getStore()
    expect(result).toStrictEqual({
      createdDate: 12312312312312
    })
    spyDomain.mockRestore()
  })

  it('created date is not present', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        manifest: {}
      }
    }
    updateRoot(obj)
    setCreatedDate(234234234)
    const result = getStore()
    expect(result).toStrictEqual({
      createdDate: 234234234
    })
    spyDomain.mockRestore()
  })
})
