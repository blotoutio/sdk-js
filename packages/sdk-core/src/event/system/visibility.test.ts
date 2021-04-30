import * as event from '../index'
import { pagehide, visibilityChange } from './visibility'
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

describe('pagehide', () => {
  it('visibility is visible, sent it', () => {
    pagehide()
    const event = new Event('pagehide')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, {
      method: 'beacon',
    })
  })

  it('visibility is hidden, do not sent', () => {
    visibilityChange()

    // set visibility visible first
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    window.dispatchEvent(new Event('visibilitychange'))
    expect(spy).toBeCalledTimes(1)
    spy.mockReset()

    // set visibility hidden
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    })
    window.dispatchEvent(new Event('visibilitychange'))
    expect(spy).toBeCalledTimes(1)
    spy.mockReset()
    pagehide()
    window.dispatchEvent(new Event('pagehide'))
    expect(spy).toBeCalledTimes(0)
  })

  it('unload fallback', () => {
    visibilityChange()
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    window.dispatchEvent(new Event('visibilitychange'))
    delete window.onpagehide
    pagehide()
    const event = new Event('unload')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, {
      method: 'beacon',
    })
  })
})

describe('visibilitychange', () => {
  it('visible', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    visibilityChange()
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_visible', event)
  })

  it('hidden', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    })
    visibilityChange()
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, { method: 'beacon' })
  })

  it('prerender', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'prerender',
      configurable: true,
    })
    visibilityChange()
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })
})
