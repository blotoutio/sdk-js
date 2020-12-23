import { getLocal, getSession, setLocal, setSession, getStoreByDomain } from '.'
import * as domain from '../common/domainUtil'
import * as store from './store'

describe('setLocal/getLocal', () => {
  it('null', () => {
    setLocal('', JSON.stringify({ data: 'test' }))
    const result = getLocal('')
    expect(result).toBe(null)
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
    expect(result).toBe(null)
  })

  it('data', () => {
    const data = JSON.stringify({ data: 'test' })
    setSession('key', data)
    const result = getSession('key')
    expect(result).toBe(data)
  })
})

describe('getStoreByDomain', () => {
  it('null', () => {
    const result = getStoreByDomain()
    expect(result).toBe(null)
  })
  it('domain generated', () => {
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => 'test.com')
    const result = getStoreByDomain()
    expect(result).toBe(null)
    spyDomain.mockRestore()
  })

  it('root do not have domain in', () => {
    const spyRoot = jest
      .spyOn(store, 'getRoot')
      .mockImplementation(() => ({
        'test.com': {}
      }))
    const result = getStoreByDomain('ok.com')
    expect(result).toBe(undefined)
    spyRoot.mockRestore()
  })

  it('all ok', () => {
    const spyRoot = jest
      .spyOn(store, 'getRoot')
      .mockImplementation(() => ({
        'test.com': {},
        'ok.com': {
          data: true
        }
      }))
    const result = getStoreByDomain('ok.com')
    expect(result).toStrictEqual({
      data: true
    })
    spyRoot.mockRestore()
  })
})
