import { codeForCustomCodifiedEvent } from './eventUtil'
import * as storage from './storageUtil'

describe('codeForCustomCodifiedEvent', () => {
  it('null', () => {
    expect(codeForCustomCodifiedEvent()).toBe(0)
  })

  it('name has spaces', () => {
    expect(codeForCustomCodifiedEvent('some awesome event')).toBe(21316)
  })

  it('name with underscore', () => {
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(21308)
  })

  it('non ascii name', () => {
    expect(codeForCustomCodifiedEvent('目_awesome_event')).toBe(21349)
  })

  it('long name', () => {
    expect(codeForCustomCodifiedEvent('event event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_eventevent event event event event event event event event event event_event_event_event_event')).toBe(21262)
  })

  it('event already exists with the same name for different events', () => {
    jest
      .spyOn(storage, 'getValueFromSPNormalUseStore')
      .mockImplementation(() => ({
        event1: 21308,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(21309)
  })

  it('event already exists with the same name same event', () => {
    jest
      .spyOn(storage, 'getValueFromSPNormalUseStore')
      .mockImplementation(() => ({
        awesome_event: 21308,
        event2: 21545
      }))
    expect(codeForCustomCodifiedEvent('awesome_event')).toBe(21308)
  })
})
