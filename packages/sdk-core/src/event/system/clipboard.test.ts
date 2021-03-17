import type { EventOptions } from '../../typings'
import * as event from '../index'
import { copy, cut, paste } from './clipboard'

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

describe('cut', () => {
  it('ok', () => {
    cut(window)
    const event = new Event('cut')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('cut', event)
  })
})

describe('copy', () => {
  it('ok', () => {
    copy(window)
    const event = new Event('copy')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('copy', event)
  })
})

describe('paste', () => {
  it('ok', () => {
    paste(window)
    const event = new Event('paste')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('paste', event)
  })
})
