import * as event from '../index'
import { touchEnd } from './touch'
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

describe('touchend', () => {
  it('ok', () => {
    touchEnd(window)
    const event = new Event('touchend')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('touchend', event)
  })
})
