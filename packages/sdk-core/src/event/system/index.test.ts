import { optionalEvents, requiredEvents } from './index'
import * as manifest from '../../common/manifest'
import * as network from './network'
import * as visibility from './visibility'
import * as events from '../.'

describe('optionalEvents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('empty', () => {
    expect(optionalEvents()).toBeUndefined()
  })

  it('call', () => {
    const spyVariable = jest
      .spyOn(manifest, 'getVariable')
      .mockReturnValue(['11119'])
    const spySendSystemEvent = jest.spyOn(events, 'sendSystemEvent')
    optionalEvents()
    const event = new Event('click')
    window.dispatchEvent(event)
    expect(spySendSystemEvent).toBeCalledTimes(1)
    spyVariable.mockRestore()
  })

  it('event does not exist', () => {
    const spy = jest.spyOn(manifest, 'getVariable').mockReturnValue(['10'])
    const map: string[] = []
    window.addEventListener = jest.fn((event: string) => {
      map.push(event)
    })
    optionalEvents()
    expect(map).toStrictEqual([])
    spy.mockRestore()
  })

  it('click and hover', () => {
    const spy = jest
      .spyOn(manifest, 'getVariable')
      .mockReturnValue(['11119', '11123'])
    const map: string[] = []
    window.addEventListener = jest.fn((event: string) => {
      map.push(event)
    })
    optionalEvents()
    expect(map).toStrictEqual(['click', 'mouseover', 'mouseout'])
    spy.mockRestore()
  })
})

describe('requiredEvents', () => {
  it('ok', () => {
    const spyPagehide = jest.spyOn(visibility, 'pagehide')
    const spyVisibilityChange = jest.spyOn(visibility, 'visibilityChange')
    const spyOnline = jest.spyOn(network, 'online')
    const spyOffline = jest.spyOn(network, 'offline')
    requiredEvents()
    expect(spyPagehide).toBeCalledTimes(1)
    expect(spyVisibilityChange).toBeCalledTimes(1)
    expect(spyOnline).toBeCalledTimes(1)
    expect(spyOffline).toBeCalledTimes(1)
    spyPagehide.mockRestore()
    spyVisibilityChange.mockRestore()
    spyOnline.mockRestore()
    spyOffline.mockRestore()
  })
})
