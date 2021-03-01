import * as event from '../'
import { hashChange } from './hash'

let spy: jest.SpyInstance<void, [string, Event?, EventOptions?]>

beforeEach(() => {
  spy = jest.spyOn(event, 'setEvent').mockImplementation()
})

afterEach(() => {
  spy.mockReset()
})

afterAll(() => {
  spy.mockRestore()
})

describe('hashchange', () => {
  it('ok', () => {
    hashChange(window)
    const event = new Event('hashchange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('hashchange', event)
  })
})
