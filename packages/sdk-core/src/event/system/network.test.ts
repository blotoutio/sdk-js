import * as event from '../index'
import { offline, online } from './network'
import * as utils from '../utils'
import type { EventOptions } from '../../typings'

let spySet: jest.SpyInstance<void, [string, Event?, EventOptions?]>

beforeEach(() => {
  spySet = jest.spyOn(event, 'setEvent').mockImplementation()
})

afterEach(() => {
  spySet.mockReset()
})

afterAll(() => {
  spySet.mockRestore()
})

describe('offline', () => {
  it('system disabled', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)

    offline(window)
    const event = new Event('offline')
    window.dispatchEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spySystem.mockRestore()
  })

  it('system enabled', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => true)

    offline(window)
    const event = new Event('offline')
    window.dispatchEvent(event)
    expect(spySet).toBeCalledWith('offline', event)
    spySystem.mockRestore()
  })
})

describe('online', () => {
  it('system disabled', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)

    online(window)
    const event = new Event('online')
    window.dispatchEvent(event)
    expect(spySet).toBeCalledTimes(0)
    spySystem.mockRestore()
  })

  it('system enabled', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => true)

    online(window)
    const event = new Event('online')
    window.dispatchEvent(event)
    expect(spySet).toBeCalledWith('online', event)
    spySystem.mockRestore()
  })
})
