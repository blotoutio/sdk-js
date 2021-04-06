import * as event from '../index'
import { reset, submit } from './form'
import type { EventOptions } from '../../typings'

let spy: jest.SpyInstance<void, [string, Event?, EventOptions?]>

beforeEach(() => {
  spy = jest.spyOn(event, 'sendSystemEvent').mockImplementation()
})

afterEach(() => {
  spy.mockReset()
})

afterAll(() => {
  spy.mockRestore()
})

describe('reset', () => {
  it('ok', () => {
    reset(window)
    const event = new Event('reset')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('reset', event)
  })
})

describe('submit', () => {
  it('ok', () => {
    submit(window)
    const event = new Event('submit')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('submit', event)
  })
})
