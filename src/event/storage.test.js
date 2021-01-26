import { getEventsByDate, getStore, setEventsByDate, setStore } from './storage'
import * as storage from '../storage'
import * as domain from '../common/domainUtil'
import * as store from '../storage/store'

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
        events: {
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

describe('setStore', () => {
  it('null', () => {
    setStore()
  })

  it('ok', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        test: {},
      },
    }
    store.updateRoot(obj)

    setStore({
      data: false,
    })
    const result = getStore()
    expect(result).toStrictEqual({
      data: false,
    })
    spyDomain.mockRestore()
  })
})

describe('getEventsByDate', () => {
  it('null', () => {
    const result = getEventsByDate()
    expect(result).toBeNull()
  })

  it('store null', () => {
    const result = getEventsByDate('15-20-2020')
    expect(result).toBeNull()
  })

  it('sdkData missing', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        events: {
          '15-20-2020': {},
        },
      },
    }
    store.updateRoot(obj)
    const result = getEventsByDate('15-20-2020')
    expect(result).toBeUndefined()
    spyDomain.mockRestore()
  })

  it('all ok', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        events: {
          '15-20-2020': {
            sdkData: {
              data: false,
            },
          },
        },
      },
    }
    store.updateRoot(obj)
    const result = getEventsByDate('15-20-2020')
    expect(result).toStrictEqual({
      data: false,
    })
    spyDomain.mockRestore()
  })
})

describe('setEventsByDate', () => {
  it('null', () => {
    setEventsByDate()
  })

  it('store null', () => {
    setEventsByDate('15-20-2020', {})
  })

  it('ok', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        events: {
          '15-20-2020': {},
        },
      },
    }
    store.updateRoot(obj)

    const spyUpdate = jest.spyOn(store, 'updateRoot').mockImplementation()

    setEventsByDate('15-20-2020', {
      data: false,
    })
    expect(spyUpdate).toBeCalledTimes(1)
    const result = getEventsByDate('15-20-2020')
    expect(result).toStrictEqual({
      data: false,
    })
    spyDomain.mockRestore()
  })
})
