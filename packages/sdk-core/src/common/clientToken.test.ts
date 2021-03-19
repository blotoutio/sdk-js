import { getClientToken, setClientToken } from './clientToken'

describe('setClientToken/getClientToken', () => {
  it('ok', () => {
    setClientToken('test-token')
    const result = getClientToken()
    expect(result).toMatch('test-token')
  })
})
