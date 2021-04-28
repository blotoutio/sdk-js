import { getIsOnline, offline, online } from './network'
import * as retries from '../../network/retries'

describe('getIsOnline', () => {
  it('default', () => {
    expect(getIsOnline()).toBeTruthy()
  })

  it('offline', () => {
    offline()
    const event = new Event('offline')
    window.dispatchEvent(event)
    expect(getIsOnline()).toBeFalsy()
  })

  it('offline and then online', () => {
    const spy = jest.spyOn(retries, 'checkRetry').mockImplementation()
    offline()
    online()
    const eventOffline = new Event('offline')
    window.dispatchEvent(eventOffline)
    const eventOnline = new Event('online')
    window.dispatchEvent(eventOnline)
    expect(getIsOnline()).toBeTruthy()
    expect(spy).toBeCalledTimes(1)
    spy.mockRestore()
  })
})
