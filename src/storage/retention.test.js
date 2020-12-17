import * as storage from '.'
import * as utils from '../utils'
import { getSDK, setSDK } from './retention'
import { updateRoot } from './store'

describe('getSDK', () => {
  it('null', () => {
    const result = getSDK()
    expect(result).toBe(null)
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
    const domain = 'test.com'
    const spyDomain = jest
      .spyOn(utils, 'getDomain')
      .mockImplementation(() => domain)
    const obj = {
      domains: [domain],
      [domain]: {
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
