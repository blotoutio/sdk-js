import * as event from '../'
import { reset, submit } from './form'

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
