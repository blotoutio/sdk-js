import * as network from '../network'
import {
  checkManifest,
  getVariable,
  loadManifest,
  pullManifest,
} from './manifest'
import { getSessionDataKey } from '../storage/key'
import { setSessionDataValue } from '../storage'

beforeEach(() => {
  window.sessionStorage.removeItem(getSessionDataKey())
})

describe('getVariable', () => {
  let spyPost: jest.SpyInstance<
    Promise<unknown>,
    [string, string, EventOptions?]
  >
  it('from defaults', () => {
    const result = getVariable('eventPath')
    expect(result).toEqual('v1/events/publish')
  })

  it('from manifest', async () => {
    spyPost = jest.spyOn(network, 'postRequest').mockImplementation(() =>
      Promise.resolve({
        variables: [
          {
            variableId: 5016,
            value: '/some-path/sdk',
            variableDataType: 6,
          },
        ],
      })
    )
    await expect(pullManifest()).resolves.toEqual(true)
    const result = getVariable('eventPath')
    expect(result).toEqual('/some-path/sdk')
    spyPost.mockRestore()
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
            variableId: 5997,
            variableDataType: 1,
          },
          {
            variableId: 5998,
            value: '323fd',
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
            variableId: 5998,
            value:
              'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtnZcbH4dJT7/yYyDIG1pSNHZcutwaFjTj7Bgm0xgSHLOy9ajF9LFUeT/9vr9Y77tuXytnCsOc7d5hZaDpy8XW7iRQ9x6CUrzUiZqgDzrmJD2GC6zKcVISGc5YjH+Iec9YAB9+SMb0/LOHZEhW97L1y6HXRtYi8BjF6e1Bk8RONwIDAQAB',
            variableDataType: 6,
          },
          {
            variableId: 5997,
            value: 5,
            variableDataType: 1,
          },
          {
            variableId: 5001,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5009,
            value: 'https://demo.blotout.io/sdk',
            variableDataType: 6,
          },
          {
            variableId: 5003,
            value: '4',
            variableDataType: 1,
          },
          {
            variableId: 5011,
            value: '24',
            variableDataType: 1,
          },
          {
            variableId: 5002,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5013,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5014,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5010,
            value: '30',
            variableDataType: 1,
          },
          {
            variableId: 5026,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5004,
            value: 2,
            variableDataType: 2,
          },
          {
            variableId: 5024,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5007,
            value: '90',
            variableDataType: 1,
          },
          {
            variableId: 5027,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5999,
            value: '1613725511959',
            variableDataType: 6,
          },
          {
            variableId: 5025,
            value: '1',
            variableDataType: 1,
          },
          {
            variableId: 5022,
            value: 'v1/segment/custom/feedback',
            variableDataType: 6,
          },
          {
            variableId: 5015,
            value: '0',
            variableDataType: 1,
          },
          {
            variableId: 5016,
            value: 'v1/events/publish',
            variableDataType: 6,
          },
          {
            variableId: 5023,
            value: 'true',
            variableDataType: 5,
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
