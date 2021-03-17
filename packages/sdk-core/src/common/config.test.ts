import { isHighFreqEventOff } from './config'

describe('isHighFreqEventOff', () => {
  it('ok', () => {
    expect(isHighFreqEventOff).toBeTruthy()
  })
})
