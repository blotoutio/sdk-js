import type { EventOptions } from '../../typings'
import * as event from '../index'
import { dragEnd, dragStart } from './dragdrop'

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

describe('dragstart', () => {
  it('ok', () => {
    dragStart(window)
    const event = new Event('dragstart')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('dragstart', event)
  })
})

describe('dragend', () => {
  it('ok', () => {
    dragEnd(window)
    const event = new Event('dragend')
    window.dispatchEvent(event)
    expect(spy).toBeCalledWith('dragend', event)
  })
})
