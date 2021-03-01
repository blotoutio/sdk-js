import * as event from '../'
import { offline, online } from './network'

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

describe('offline', () => {
  it('ok', () => {
    offline(window)
    const event = new Event('offline')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('offline', event)
  })
})

describe('online', () => {
  it('ok', () => {
    online(window)
    const event = new Event('online')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('online', event)
  })
})
