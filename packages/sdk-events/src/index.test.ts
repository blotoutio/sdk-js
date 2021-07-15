import { mapID } from './index'
import * as core from '@blotoutio/sdk-core'

let spySet: jest.SpyInstance<
  void,
  [events: core.SendEvent[], options?: core.EventOptions]
>
let spyCreate: jest.SpyInstance<core.BasicEvent, [event: core.IncomingEvent]>

beforeEach(() => {
  spySet = jest.spyOn(core.internalUtils, 'sendEvent').mockImplementation()
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
  spyCreate = jest
    .spyOn(core.internalUtils, 'createBasicEvent')
    .mockImplementation(() => ({
      evcs: 21001,
      mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'map_id',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    }))
})

afterEach(() => {
  spySet.mockRestore()
  spyCreate.mockRestore()
})

describe('mapID', () => {
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
    mapID({ externalID: 'sdfasfasdfds', provider: 'service' })
    expect(spySet).toBeCalledWith(
      [
        {
          type: 'codified',
          data: {
            evcs: 21001,
            mid: 'bWFwX2lk-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
            name: 'map_id',
            tstmp: 1580775120000,
            urlPath: 'http://localhost/',
          },
          extra: { map_id: 'sdfasfasdfds', map_provider: 'service' },
        },
      ],
      undefined
    )
    spyEnabled.mockReset()
  })
})
