import { getSessionKeyForEventType } from './utils'

describe('getSessionKeyForEventType', () => {
  it('null', () => {
    expect(getSessionKeyForEventType(null)).toBeNull()
  })

  it('system', () => {
    expect(getSessionKeyForEventType('system')).toBe('dataSystem')
  })

  it('codified', () => {
    expect(getSessionKeyForEventType('codified')).toBe('dataCodified')
  })

  it('pii', () => {
    expect(getSessionKeyForEventType('pii')).toBe('dataPII')
  })

  it('phi', () => {
    expect(getSessionKeyForEventType('phi')).toBe('dataPHI')
  })
})
