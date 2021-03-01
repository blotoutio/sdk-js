import * as event from '../'
import { error } from './resource'

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

describe('error', () => {
  it('ok', () => {
    error(window)
    const event = new Event('error')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('error', event)
  })
})
