import { postRequest } from '.'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

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
      json: async () => result,
    })

    await expect(postRequest('https://blotout.io')).resolves.toBe(result)
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
        },
        body: '',
      })
    )
  })

  it('200', async () => {
    const result = { success: true }
    window.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => result,
    })

    await expect(postRequest('https://blotout.io', payload)).resolves.toBe(
      result
    )
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
        },
        body: payload,
      })
    )
  })

  it('500', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 500,
      json: async () => 'Server error',
    })

    await expect(postRequest('https://blotout.io', payload)).rejects.toThrow(
      'Server error'
    )
    expect(window.fetch).toHaveBeenCalledWith(
      'https://blotout.io',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
        },
        body: payload,
      })
    )
  })
})
