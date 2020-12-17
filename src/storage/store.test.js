import { getRoot, updateRoot } from './store'
import * as storage from '.'
import * as utils from '../utils'
import * as manifest from './manifest'
import * as security from '../common/securityUtil'

let spyRoot
beforeEach(() => {
  spyRoot = jest
    .spyOn(utils, 'getRootKey')
    .mockImplementation(() => 'localhost')
})

afterEach(() => {
  spyRoot.mockRestore()
})

describe('getRoot', () => {
  beforeEach(() => {
    updateRoot(null)
  })

  it('null', () => {
    const result = getRoot()
    expect(result).toBe(null)
  })

  it('memory value set', () => {
    updateRoot({
      data: true
    })
    const result = getRoot()
    expect(result).toStrictEqual({
      data: true
    })
  })

  it('corrupted JSON', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation(() => '{"domains":[}')
    const result = getRoot()
    expect(result).toBe(null)
    spyGet.mockRestore()
  })

  it('plain JSON', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation(() => JSON.stringify({ domains: [] }))

    const result = getRoot()
    expect(result).toStrictEqual({
      domains: []
    })
    spyGet.mockRestore()
  })

  it('encrypted JSON', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation(() => 'KTjIPhc3iFPwiSgWew3')
    const spyDecrypt = jest
      .spyOn(security, 'decryptAES')
      .mockImplementation(() => '{"domains":[]}')

    const result = getRoot()
    expect(result).toStrictEqual({
      domains: []
    })
    spyGet.mockRestore()
    spyDecrypt.mockRestore()
  })

  it('description failed', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation((name) => {
        if (name === 'localhost') {
          return 'dsfsf'
        }
        return null
      })
    const spyInit = jest
      .spyOn(utils, 'initialize')
      .mockImplementation(() => {})
    const result = getRoot()
    expect(result).toBe(null)
    spyGet.mockRestore()
    spyInit.mockRestore()
  })
})

describe('updateRoot', () => {
  let spySet
  beforeEach(() => {
    spySet = jest
      .spyOn(storage, 'setLocal')
      .mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('null', () => {
    updateRoot()
    expect(spySet).toHaveBeenCalledTimes(0)
  })

  it('store provided', () => {
    updateRoot({ data: true })
    expect(spySet).toHaveBeenCalledTimes(0)
  })

  it('manifest var provided, expired', () => {
    const spyManifest = jest
      .spyOn(utils, 'getManifestVariable')
      .mockImplementation(() => 1)

    const spyDate = jest
      .spyOn(manifest, 'getModifiedDate')
      .mockImplementation(() => Date.now() - (2 * 24 * 60 * 60 * 1000)) // 2 days
    updateRoot({ data: true })
    expect(spySet).toHaveBeenCalledTimes(0)
    spyManifest.mockRestore()
    spyDate.mockRestore()
  })

  it('manifest var not provided, not expired', () => {
    const spyDate = jest
      .spyOn(manifest, 'getModifiedDate')
      .mockImplementation(() => Date.now())
    const spySecurity = jest
      .spyOn(security, 'encryptAES')
      .mockImplementation(() => ({
        encryptedString: 'sodfkasfijsadifjasfasdf',
        key: 'asdfasfasdfsd',
        iv: 'dfasfasdfasdf'
      }))
    updateRoot({ data: true })
    expect(spySet).toHaveBeenCalledWith('localhost', 'sodfkasfijsadifjasfasdf')
    spyDate.mockRestore()
    spySecurity.mockRestore()
  })

  it('encryption disabled', () => {
    const spyDate = jest
      .spyOn(manifest, 'getModifiedDate')
      .mockImplementation(() => Date.now())
    const spySecurity = jest
      .spyOn(security, 'shouldEncrypt')
      .mockImplementation(() => false)

    updateRoot({ data: true })
    expect(spySet).toHaveBeenCalledWith('localhost', '{"data":true}')
    spyDate.mockRestore()
    spySecurity.mockRestore()
  })
})
