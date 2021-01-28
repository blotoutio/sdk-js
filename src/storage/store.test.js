import { getRoot, updateRoot } from './store'
import * as storage from '.'
import * as init from '../common/init'
import * as key from './key'
import * as security from '../common/securityUtil'

let spyRoot
beforeEach(() => {
  spyRoot = jest.spyOn(key, 'getRootKey').mockImplementation(() => 'localhost')
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
    expect(result).toBeNull()
  })

  it('memory value set', () => {
    updateRoot({
      data: true,
    })
    const result = getRoot()
    expect(result).toStrictEqual({
      data: true,
    })
  })

  it('corrupted JSON', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation(() => '{"domains":[}')
    const result = getRoot()
    expect(result).toBeNull()
    spyGet.mockRestore()
  })

  it('plain JSON', () => {
    const spyGet = jest
      .spyOn(storage, 'getLocal')
      .mockImplementation(() => JSON.stringify({ domains: [] }))

    const result = getRoot()
    expect(result).toStrictEqual({
      domains: [],
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
      domains: [],
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
    const spyInit = jest.spyOn(init, 'initialize').mockImplementation(() => {})
    const result = getRoot()
    expect(result).toBeNull()
    spyGet.mockRestore()
    spyInit.mockRestore()
  })
})
