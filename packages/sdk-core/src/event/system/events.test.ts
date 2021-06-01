import { systemEvents } from './events'
import * as event from '../index'
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

describe('systemEvents', () => {
  it('check entries', () => {
    expect(Object.keys(systemEvents).length).toBe(23)
  })

  it('keydown, no help', () => {
    systemEvents['11107'].operation()
    const event = new KeyboardEvent('keydown', { key: 'KeyF' })
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })

  it('keydown, help', () => {
    const event = new KeyboardEvent('keydown', { key: 'F1' })
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })

  it('scroll, no delay', () => {
    systemEvents['11122'].operation()
    const event = new Event('scroll')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })

  it('scroll, delay', () => {
    jest.useFakeTimers()
    systemEvents['11122'].operation()
    const event = new Event('scroll')
    window.dispatchEvent(event)
    jest.runAllTimers()
    expect(spy).toBeCalledWith('scroll', event)
  })

  it('hover, no delay', () => {
    systemEvents['11123'].operation()
    const eventOver = new Event('mouseover')
    window.dispatchEvent(eventOver)
    const eventOut = new Event('mouseout')
    window.dispatchEvent(eventOut)
    expect(spy).toBeCalledTimes(0)
  })

  it('hover, delay', () => {
    jest.useFakeTimers()
    const event = new Event('mouseover')
    window.dispatchEvent(event)
    jest.runAllTimers()
    expect(spy).toBeCalledWith('hover', event)
  })

  it('click', () => {
    systemEvents['11119'].operation()
    const event = new KeyboardEvent('click')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
