import { mapID } from './index'
import * as events from './events'
import * as core from '@blotoutio/sdk-core'

describe('mapID', () => {
  let spySet: jest.SpyInstance<
    void,
    [events: core.SendEvent[], options?: core.EventOptions]
  >
  beforeEach(() => {
    spySet = jest.spyOn(core.internalUtils, 'sendEvent').mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('SDK is disabled', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => false)
    mapID({ externalID: 'sdfasfasdfds', provider: 'service' })
    expect(spySet).toBeCalledTimes(0)
    spyEnabled.mockReset()
  })

  it('ok', () => {
    const spyEnabled = jest
      .spyOn(core, 'isEnabled')
      .mockImplementation(() => true)
    const spyEvent = jest.spyOn(events, 'mapID').mockImplementation()
    mapID({ externalID: 'sdfasfasdfds', provider: 'service' })
    expect(spyEvent).toBeCalledTimes(1)
    spyEvent.mockReset()
    spyEnabled.mockReset()
  })
})
