import * as storage from '../storage'
import * as domain from '../common/domainUtil'
import {
  setData,
  getData,
  getStore,
  getModifiedDate,
  setCreatedDate,
  setModifiedDate,
} from './storage'
import { updateRoot } from '../storage/store'

describe('getStore', () => {
  it('null', () => {
    const result = getStore()
    expect(result).toBeNull()
  })

  it('store present, but no events', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        test: {},
      }))
    const result = getStore()
    expect(result).toBeUndefined()
    spyDomain.mockRestore()
  })

  it('all ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          data: true,
        },
      }))
    const result = getStore()
    expect(result).toStrictEqual({
      data: true,
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
      data: false,
    })
  })

  it('ok', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        manifest: {},
      },
    }
    updateRoot(obj)

    setData({
      data: false,
    })
    const result = getData()
    expect(result).toStrictEqual({
      data: false,
    })
    spyDomain.mockRestore()
  })
})

describe('getData', () => {
  it('null', () => {
    const result = getData()
    expect(result).toBeNull()
  })

  it('ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          manifestData: {
            data: true,
          },
        },
      }))
    const result = getData()
    expect(result).toStrictEqual({
      data: true,
    })
    spyDomain.mockRestore()
  })
})

describe('getModifiedDate', () => {
  it('null', () => {
    const result = getModifiedDate()
    expect(result).toBeNull()
  })

  it('ok', () => {
    const spyDomain = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        manifest: {
          modifiedDate: 43513245235,
        },
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
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        manifest: {},
      },
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
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        manifest: {
          createdDate: 12312312312312,
        },
      },
    }
    updateRoot(obj)
    setCreatedDate(234234234)
    const result = getStore()
    expect(result).toStrictEqual({
      createdDate: 12312312312312,
    })
    spyDomain.mockRestore()
  })

  it('created date is not present', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        manifest: {},
      },
    }
    updateRoot(obj)
    setCreatedDate(234234234)
    const result = getStore()
    expect(result).toStrictEqual({
      createdDate: 234234234,
    })
    spyDomain.mockRestore()
  })
})
