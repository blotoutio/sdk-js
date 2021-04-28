import * as network from '../network'
import {
  checkManifest,
  getVariable,
  loadManifest,
  pullManifest,
} from './manifest'
import { getSessionDataKey } from '../storage/key'
import { setSessionDataValue } from '../storage'
import type { EventOptions } from '../typings'

beforeEach(() => {
  window.sessionStorage.removeItem(getSessionDataKey())
})

describe('getVariable', () => {
  it('no manifest', () => {
    const result = getVariable('systemEvents')
    expect(result).toBeNull()
  })

  it('from manifest', async () => {
    const spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [
          {
            variableId: 5001,
            value: '11119,11118',
            variableDataType: 7,
          },
        ],
      })
    )
    await expect(pullManifest()).resolves.toEqual(true)
    const result = getVariable('systemEvents')
    expect(result).toStrictEqual(['11119', '11118'])
    spyPost.mockReset()
  })
})

describe('pullManifest', () => {
  let spyPost: jest.SpyInstance<
    Promise<unknown>,
    [string, string, EventOptions?]
  >

  afterEach(() => {
    spyPost.mockReset()
  })

  afterAll(() => {
    spyPost.mockRestore()
  })

  it('server error', () => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.reject(new Error('server error')))
    expect(pullManifest()).rejects.toEqual(new Error('server error'))
  })

  it('response is empty', () => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve({}))
    expect(pullManifest()).resolves.toEqual(true)
  })

  it('response has variables, but nothing else', () => {
    spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [],
      })
    )
    expect(pullManifest()).resolves.toEqual(true)
  })

  it('response has variables, variable is wrong', () => {
    spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [
          {
            variableId: 5998,
            value: '323fd',
            variableDataType: 8,
          },
          {
            variableId: 5001,
            value: '',
            variableDataType: 7,
          },
        ],
      })
    )
    expect(pullManifest()).resolves.toEqual(true)
  })

  it('response has variables, variable is wrong', () => {
    spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [
          {
            variableId: 5001,
            variableDataType: 7,
          },
        ],
      })
    )
    expect(pullManifest()).resolves.toEqual(true)
  })

  it('response is ok', () => {
    spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [
          {
            variableId: 5997,
            value:
              'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtnZcbH4dJT7/yYyDIG1pSNHZcutwaFjTj7Bgm0xgSHLOy9ajF9LFUeT/9vr9Y77tuXytnCsOc7d5hZaDpy8XW7iRQ9x6CUrzUiZqgDzrmJD2GC6zKcVISGc5YjH+Iec9YAB9+SMb0/LOHZEhW97L1y6HXRtYi8BjF6e1Bk8RONwIDAQAB',
            variableDataType: 6,
          },
        ],
      })
    )
    expect(pullManifest()).resolves.toEqual(true)
  })
})

describe('checkManifest', () => {
  let spyPost: jest.SpyInstance<
    Promise<unknown>,
    [string, string, EventOptions?]
  >

  afterEach(() => {
    spyPost.mockReset()
  })

  afterAll(() => {
    spyPost.mockRestore()
  })

  it('ok', async () => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
    await expect(checkManifest()).resolves.toEqual(true)
    expect(spyPost).toBeCalledTimes(1)
  })

  it('error on pull', async () => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.reject(new Error('Server problem')))
    await expect(checkManifest()).rejects.toEqual(new Error('Server problem'))
    expect(spyPost).toBeCalledTimes(1)
  })
})

describe('loadManifest', () => {
  it('session not set yet', () => {
    expect(loadManifest()).toBeFalsy()
  })

  it('session set', () => {
    setSessionDataValue('manifest', {})
    expect(loadManifest()).toBeTruthy()
  })
})
