import * as event from '../'
import { domActive, domSubTreeModified, pagehide, scroll } from './window'

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

describe('pagehide', () => {
  it('ok', () => {
    pagehide(window)
    const event = new Event('pagehide')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('pagehide', event, {
      method: 'beacon',
    })
  })

  it('fallback unload', () => {
    delete window.onpagehide
    pagehide(window)
    const event = new Event('unload')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('pagehide', event, {
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
