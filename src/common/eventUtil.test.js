import { codeForCustomCodifiedEvent } from './eventUtil'
import * as storage from './storageUtil'

describe('codeForCustomCodifiedEvent', () => {
  it('null', () => {
    expect(codeForCustomCodifiedEvent()).toBe(0)
  })

  it('name has spaces', () => {
    expect(codeForCustomCodifiedEvent('some awesome event')).toBe(24016)
  })

  it('name with underscore', () => {
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24008)
  })

  it('non ascii name', () => {
    expect(codeForCustomCodifiedEvent('目_awesome_event')).toBe(24049)
  })

  it('long name', () => {
    expect(codeForCustomCodifiedEvent('event event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_event')).toBe(23962)
  })

  it('event already exists with the same name for different events', () => {
    jest
      .spyOn(storage, 'getValueFromSPNormalUseStore')
      .mockImplementation(() => ({
        event1: 24008,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24009)
  })

  it('event already exists with the same name same event', () => {
    jest
      .spyOn(storage, 'getValueFromSPNormalUseStore')
      .mockImplementation(() => ({
        awesome_event: 24008,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(24008)
  })
})
