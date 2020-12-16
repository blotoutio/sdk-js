import { getRequest, postRequest } from './networkUtil'
import * as storage from '../storage/sharedPreferences'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

describe('getRequest', () => {
  it('empty url', async () => {
    await expect(getRequest()).rejects.toThrow('URL is empty')
    expect(window.fetch).toHaveBeenCalledTimes(0)
  })

  it('200', async () => {
    jest
      .spyOn(storage, 'getValueFromSPTempUseStore')
      .mockImplementation(() => 'aosdfkaosfkoaskfo23e23')

    const result = { success: true }
    window.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => result
    })

    await expect(getRequest('https://blotout.io')).resolves.toBe(result)
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json; charset=utf-8',
          version: 'v1',
          token: 'aosdfkaosfkoaskfo23e23'
        }
      }))
  })

  it('500', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 500,
      json: async () => 'Server error'
    })

    await expect(getRequest('https://blotout.io')).rejects.toThrow('Server error')
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json; charset=utf-8',
          version: 'v1',
          token: ''
        }
      }))
  })
})

describe('postRequest', () => {
  const payload = '{"data":"test"}'

  it('empty url', async () => {
    await expect(postRequest()).rejects.toThrow('URL is empty')
    expect(window.fetch).toHaveBeenCalledTimes(0)
  })

  it('empty payload', async () => {
    const result = { success: true }
    window.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => result
    })

    await expect(postRequest('https://blotout.io')).resolves.toBe(result)
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
          version: 'v1',
          token: ''
        },
        body: ''
      }))
  })

  it('200', async () => {
    jest
      .spyOn(storage, 'getValueFromSPTempUseStore')
      .mockImplementation(() => 'aosdfkaosfkoaskfo23e23')

    const result = { success: true }
    window.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => result
    })

    await expect(postRequest('https://blotout.io', payload)).resolves.toBe(result)
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
          version: 'v1',
          token: 'aosdfkaosfkoaskfo23e23'
        },
        body: payload
      }))
  })

  it('500', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 500,
      json: async () => 'Server error'
    })

    await expect(postRequest('https://blotout.io', payload)).rejects.toThrow('Server error')
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
          version: 'v1',
          token: ''
        },
        body: payload
      }))
  })
})
