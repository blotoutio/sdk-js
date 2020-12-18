import { getEventsByDate, getStore, setEventsByDate, setStore } from './event'
import * as storage from '.'
import * as utils from '../utils'
import { updateRoot } from './store'

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
        events: {
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

describe('setStore', () => {
  it('null', () => {
    setStore()
  })

  it('ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        test: {}
      }
    }
    updateRoot(obj)

    setStore({
      data: false
    })
    const result = getStore()
    expect(result).toStrictEqual({
      data: false
    })
    spyDomain.mockRestore()
  })
})

describe('getEventsByDate', () => {
  it('null', () => {
    const result = getEventsByDate()
    expect(result).toBe(null)
  })

  it('store null', () => {
    const result = getEventsByDate('15-20-2020')
    expect(result).toBe(null)
  })

  it('sdkData missing', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        events: {
          '15-20-2020': {}
        }
      }
    }
    updateRoot(obj)
    const result = getEventsByDate('15-20-2020')
    expect(result).toBe(undefined)
    spyDomain.mockRestore()
  })

  it('all ok', () => {
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        events: {
          '15-20-2020': {
            sdkData: {
              data: false
            }
          }
        }
      }
    }
    updateRoot(obj)
    const result = getEventsByDate('15-20-2020')
    expect(result).toStrictEqual({
      data: false
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
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
        events: {
          '15-20-2020': {}
        }
      }
    }
    updateRoot(obj)

    setEventsByDate('15-20-2020', {
      data: false
    })
    const result = getEventsByDate('15-20-2020')
    expect(result).toStrictEqual({
      data: false
    })
    spyDomain.mockRestore()
  })
})
