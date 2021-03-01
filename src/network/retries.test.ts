import * as storage from '../storage'
import * as network from '.'
import { addItem, checkRetry, getItem } from './retries'

describe('addItem', () => {
  it('corrupted session data', () => {
    storage.setSessionDataValue('retries', ']sdfsd')

    addItem({
      payload: '{data: true}',
      url: 'https://domain.com',
    })
  })

  it('ok', () => {
    addItem({
      payload: '{data: true}',
      url: 'https://domain.com',
    })

    expect(storage.getSessionDataValue('retries')).toStrictEqual(
      '[{"payload":"{data: true}","url":"https://domain.com"},{"payload":"{data: true}","url":"https://domain.com"}]'
    )
  })
})

describe('getItem', () => {
  let spyGet: jest.SpyInstance<unknown, [keyof SessionData]>
  let spySet: jest.SpyInstance<void, [keyof SessionData, unknown]>

  afterEach(() => {
    spyGet.mockReset()
  })

  afterAll(() => {
    spyGet.mockRestore()
    spySet.mockRestore()
  })

  it('nothing in there', () => {
    spyGet = jest
      .spyOn(storage, 'getSessionDataValue')
      .mockImplementation(() => null)
    const result = getItem()
    expect(result).toBeNull()
  })

  it('broken JSON', () => {
    spyGet = jest
      .spyOn(storage, 'getSessionDataValue')
      .mockImplementation(() => 'p[p')
    const result = getItem()
    expect(result).toBeNull()
  })

  it('not array', () => {
    spyGet = jest
      .spyOn(storage, 'getSessionDataValue')
      .mockImplementation(() => '{data: true}')
    const result = getItem()
    expect(result).toBeNull()
  })

  it('empty array', () => {
    spyGet = jest
      .spyOn(storage, 'getSessionDataValue')
      .mockImplementation(() => [])
    const result = getItem()
    expect(result).toBeNull()
  })

  it('ok', () => {
    spyGet = jest
      .spyOn(storage, 'getSessionDataValue')
      .mockImplementation(() => [
        {
          payload: 'data',
          url: 'https://domain.com',
        },
      ])
    spySet = jest.spyOn(storage, 'setSessionDataValue').mockImplementation()
    const result = getItem()
    expect(result).toStrictEqual({ payload: 'data', url: 'https://domain.com' })
    expect(spySet).toBeCalledWith('retries', '[]')
    spySet.mockReset()
  })
})

describe('checkRetry', () => {
  let spy: jest.SpyInstance<Promise<unknown>, [string, string, EventOptions?]>

  afterEach(() => {
    spy.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('no entry', () => {
    spy = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
    storage.setSessionDataValue('retries', '')
    checkRetry()
    expect(spy).toBeCalledTimes(0)
  })

  it('with data', () => {
    spy = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
    storage.setSessionDataValue(
      'retries',
      JSON.stringify([
        {
          payload: 'data',
          url: 'https://domain.com',
        },
      ])
    )
    checkRetry()
    expect(spy).toBeCalledTimes(1)
  })

  it('with a lot of retries', () => {
    spy = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.reject(new Error('Server Error')))
    jest.useFakeTimers()
    jest.spyOn(storage, 'getSessionDataValue').mockImplementation(() =>
      JSON.stringify([
        {
          payload: 'd1ata',
          url: 'https://domain.com',
        },
      ])
    )

    checkRetry()
    jest.runAllTimers()
    checkRetry()
    jest.runAllTimers()
    checkRetry()
    jest.runAllTimers()
    checkRetry()
    jest.runAllTimers()
    // expect(spy).toBeCalledTimes(1)
  })
})
