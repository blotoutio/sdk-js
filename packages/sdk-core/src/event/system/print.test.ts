import * as event from '../index'
import { print } from './print'
import type { EventOptions } from '../../typings'

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
