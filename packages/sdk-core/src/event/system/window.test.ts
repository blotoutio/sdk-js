import * as event from '../index'
import {
  domActive,
  domSubTreeModified,
  pagehide,
  scroll,
  visibilityChange,
} from './window'
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
    pagehide(window)
    const event = new Event('pagehide')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, {
      method: 'beacon',
    })
  })

  it('visibility is hidden, do not sent', () => {
    visibilityChange(window)

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
    pagehide(window)
    window.dispatchEvent(new Event('pagehide'))
    expect(spy).toBeCalledTimes(0)
  })

  it('unload fallback', () => {
    visibilityChange(window)
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    window.dispatchEvent(new Event('visibilitychange'))
    delete window.onpagehide
    pagehide(window)
    const event = new Event('unload')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, {
      method: 'beacon',
    })
  })
})

describe('DOMSubtreeModified', () => {
  it('no delay', () => {
    domSubTreeModified(window)
    const event = new Event('DOMSubtreeModified')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })

  it('with delay', () => {
    jest.useFakeTimers()
    domSubTreeModified(window)
    const event = new Event('DOMSubtreeModified')
    window.dispatchEvent(event)
    jest.runAllTimers()
    expect(spy).toBeCalledWith('DOMSubtreeModified', event)
  })
})

describe('domActive', () => {
  it('ok', () => {
    domActive(window)
    const event = new Event('DOMActivate')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('DOMActivate', event)
  })
})

describe('scroll', () => {
  it('no delay', () => {
    scroll(window)
    const event = new Event('scroll')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })

  it('with delay', () => {
    jest.useFakeTimers()
    scroll(window)
    const event = new Event('scroll')
    window.dispatchEvent(event)
    jest.runAllTimers()
    expect(spy).toBeCalledWith('scroll', event)
  })
})

describe('visibilitychange', () => {
  it('visible', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    console.log(document.visibilityState)
    visibilityChange(window)
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_visible', event)
  })

  it('hidden', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    })
    console.log(document.visibilityState)
    visibilityChange(window)
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('visibility_hidden', event, { method: 'beacon' })
  })

  it('prerender', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'prerender',
      configurable: true,
    })
    console.log(document.visibilityState)
    visibilityChange(window)
    const event = new Event('visibilitychange')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(0)
  })
})
