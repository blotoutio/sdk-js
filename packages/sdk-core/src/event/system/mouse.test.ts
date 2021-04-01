import * as event from '../index'
import { click, contextMenu, doubleClick, hover } from './mouse'
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

describe('click', () => {
  it('ok', () => {
    click(window)
    const event = new Event('click')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('click', event)
  })
})

describe('dblclick', () => {
  it('ok', () => {
    doubleClick(window)
    const event = new Event('dblclick')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('dblclick', event)
  })
})

describe('contextmenu', () => {
  it('ok', () => {
    contextMenu(window)
    const event = new Event('contextmenu')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('contextmenu', event)
  })
})

describe('hover', () => {
  it('no delay', () => {
    hover(window)
    const eventOver = new Event('mouseover')
    window.dispatchEvent(eventOver)
    const eventOut = new Event('mouseout')
    window.dispatchEvent(eventOut)
    expect(spy).toBeCalledTimes(0)
  })

  it('with delay', () => {
    jest.useFakeTimers()
    hover(window)
    const event = new Event('mouseover')
    window.dispatchEvent(event)
    jest.runAllTimers()
    expect(spy).toBeCalledWith('hover', event)
  })
})
