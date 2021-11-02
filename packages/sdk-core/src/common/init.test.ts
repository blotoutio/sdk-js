import { init } from './init'
import * as endPoint from '../network/endPoint'
import * as storage from '../storage'
import * as key from '../storage/key'
import * as eventSystem from '../event/system'
import * as event from '../event'
import * as clientToken from './clientToken'
import * as manifest from './manifest'
import { setSessionDataValue } from '../storage'
import { constants } from './config'
import { setEnable } from './enabled'

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
  setEnable(true)
})

describe('init', () => {
  it('empty', () => {
    init()
  })

  it('token is not correct', () => {
    init({
      token: '',
      endpointUrl: 'https://domain.com/sdk',
    })
  })

  it('SDK is disabled', () => {
    const spySendSystemEvent = jest.spyOn(event, 'sendSystemEvent')
    setEnable(false)
    init({
      token: '3WBQ5E48ND3VTPC',
      endpointUrl: 'https://domain.com/sdk',
      storageRootKey: 'foo',
    })
    expect(spySendSystemEvent).toBeCalledTimes(0)
    spySendSystemEvent.mockRestore()
  })

  it('new session', () => {
    window.sessionStorage.clear()
    const spySetUrl = jest.spyOn(endPoint, 'setUrl')
    const spySetClientToken = jest.spyOn(clientToken, 'setClientToken')
    const spySetRootKey = jest.spyOn(key, 'setRootKey')
    const spySendSystemEvent = jest.spyOn(event, 'sendSystemEvent')
    const spyRequiredEvents = jest.spyOn(eventSystem, 'requiredEvents')
    const spyCheckManifest = jest
      .spyOn(manifest, 'checkManifest')
      .mockImplementation(() => Promise.resolve(true))

    init({
      token: '3WBQ5E48ND3VTPC',
      endpointUrl: 'https://domain.com/sdk',
      storageRootKey: 'foo',
    })

    expect(spySetUrl).toBeCalledWith('https://domain.com/sdk')
    expect(spySetClientToken).toBeCalledWith('3WBQ5E48ND3VTPC')
    expect(spySetRootKey).toBeCalledWith('foo')
    expect(spySendSystemEvent).toBeCalledWith(constants.SDK_START)
    expect(spyRequiredEvents).toBeCalledTimes(1)

    spySetUrl.mockRestore()
    spySetClientToken.mockRestore()
    spySetRootKey.mockRestore()
    spySendSystemEvent.mockRestore()
    spyRequiredEvents.mockRestore()
    spyCheckManifest.mockRestore()
  })

  it('old session', () => {
    const spyStorage = jest
      .spyOn(storage, 'checkSession')
      .mockImplementation(() => false)
    const spyLoad = jest
      .spyOn(manifest, 'loadManifest')
      .mockImplementation(() => true)
    const spyCheckManifest = jest
      .spyOn(manifest, 'checkManifest')
      .mockImplementation()

    setSessionDataValue('manifest', {})
    init({
      token: '3WBQ5E48ND3VTPC',
      endpointUrl: 'https://domain.com/sdk',
    })
    expect(spyCheckManifest).toBeCalledTimes(0)

    spyStorage.mockRestore()
    spyCheckManifest.mockRestore()
    spyLoad.mockRestore()
  })
})
