import * as eventSession from './session'
import * as eventUtils from './utils'
import * as storage from '../storage'
import { mapIDEvent, sendStartEvent } from '.'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

let spySession
beforeEach(() => {
  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation(() => 124123423)

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('mapIDEvent', () => {
  let spySet
  beforeEach(() => {
    spySet = jest.spyOn(eventSession, 'setDevEvent').mockImplementation()
  })

  afterEach(() => {
    spySet.mockRestore()
  })

  it('null', () => {
    mapIDEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no data', () => {
    mapIDEvent('sdfasfasdfds', 'service')
    expect(spySet).toBeCalledWith(
      'map_id',
      {
        map_id: 'sdfasfasdfds',
        map_provider: 'service',
      },
      21001
    )
  })

  it('with data', () => {
    mapIDEvent('sdfasfasdfds', 'service', { custom: true })
    expect(spySet).toBeCalledWith(
      'map_id',
      {
        map_id: 'sdfasfasdfds',
        map_provider: 'service',
        custom: true,
      },
      21001
    )
  })
})

describe('sendStartEvent', () => {
  it('ok', () => {
    const spySend = jest.spyOn(eventUtils, 'sendEvents').mockImplementation()
    sendStartEvent()
    expect(spySend).toBeCalledWith([
      {
        evcs: 11130,
        mid: 'localhost-null-1580775120000',
        name: 'sdk_start',
        sentToServer: false,
        tstmp: 1580775120000,
        urlPath: 'http://localhost/',
      },
    ])
    spySend.mockRestore()
  })
})
