import { checkEnabled, isEnabled, setEnable, setInitialised } from './enabled'
import * as storage from '../storage'
import { getSessionDataKey } from '../storage/key'

describe('setEnable', () => {
  let spySet: jest.SpyInstance<void, [key: keyof SessionData, value: unknown]>

  it('ok', () => {
    spySet = jest.spyOn(storage, 'setSessionDataValue').mockImplementation()
    setEnable(false)
    expect(spySet).toBeCalledWith('enabled', false)
    spySet.mockRestore()
  })
})

describe('isEnabled', () => {
  it('default', () => {
    expect(isEnabled()).toBeFalsy()
  })

  it('SDK is initialized', () => {
    setEnable(true)
    setInitialised()
    expect(isEnabled()).toBeTruthy()
  })

  it('SDK is disabled', () => {
    setInitialised()
    setEnable(false)
    expect(isEnabled()).toBeFalsy()
  })
})

describe('checkEnabled', () => {
  it('session is not set', () => {
    window.sessionStorage.removeItem(getSessionDataKey())
    expect(checkEnabled()).toBeFalsy()
  })

  it('session is set to false', () => {
    setEnable(false)
    expect(checkEnabled()).toBeFalsy()
  })

  it('session is set to true', () => {
    setEnable(true)
    expect(checkEnabled()).toBeTruthy()
  })
})
