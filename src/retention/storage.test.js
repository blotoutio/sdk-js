import * as storage from '../storage'
import * as domain from '../common/domainUtil'
import { getSDK, setSDK } from './storage'
import { updateRoot } from '../storage/store'

describe('getSDK', () => {
  it('null', () => {
    const result = getSDK()
    expect(result).toBeNull()
  })

  it('ok', () => {
    const spyGet = jest
      .spyOn(storage, 'getStoreByDomain')
      .mockImplementation(() => ({
        retention: {
          retentionSDK: {
            data: true
          }
        }
      }))

    const result = getSDK()
    expect(result).toStrictEqual({
      data: true
    })
    spyGet.mockRestore()
  })
})

describe('setSDK', () => {
  it('null', () => {
    setSDK()
  })

  it('ok', () => {
    const domainName = 'test.com'
    const spyDomain = jest
      .spyOn(domain, 'getDomain')
      .mockImplementation(() => domainName)
    const obj = {
      domains: [domainName],
      [domainName]: {
        retention: {}
      }
    }
    updateRoot(obj)

    setSDK({
      data: false
    })
    const result = getSDK()
    expect(result).toStrictEqual({
      data: false
    })
    spyDomain.mockRestore()
  })
})
