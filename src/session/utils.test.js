import { checkAndGetSessionId } from './utils'
import * as storage from '../storage'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('checkAndGetSessionId', () => {
  it('session do no exist yet', () => {
    const id = 1580775120000
    const spySet = jest.spyOn(storage, 'setSession').mockImplementation()

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    expect(spySet).toHaveBeenCalledWith('sessionId', id)
    spySet.mockRestore()
  })

  it('session exists', () => {
    const id = Date.now()
    const spyGet = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => id)

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    spyGet.mockRestore()
  })
})
