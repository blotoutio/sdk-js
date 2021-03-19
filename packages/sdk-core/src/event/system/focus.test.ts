import * as event from '../index'
import { blur, focus } from './focus'
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

describe('blur', () => {
  it('ok', () => {
    blur(window)
    const event = new Event('blur')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('blur', event)
  })
})

describe('focus', () => {
  it('ok', () => {
    focus(window)
    const event = new Event('focus')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('focus', event)
  })
})
