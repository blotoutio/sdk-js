import * as event from '../index'
import { keyDown, keyPressed } from './keyboard'
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

describe('keypress', () => {
  it('ok', () => {
    keyPressed(window)
    const event = new Event('keypress')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('keypress', event)
  })
})

describe('submit', () => {
  keyDown(window)

  it('not help key', () => {
    const event = new KeyboardEvent('keydown', { key: 'KeyF' })
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })

  it('help key', () => {
    const event = new KeyboardEvent('keydown', { key: 'F1' })
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
