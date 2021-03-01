import * as event from '../'
import { print } from './print'

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

describe('afterprint', () => {
  it('ok', () => {
    print(window)
    const event = new Event('afterprint')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('afterprint', event)
  })
})
