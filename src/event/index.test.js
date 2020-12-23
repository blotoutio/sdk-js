import * as eventStorage from '../event/storage'
import * as utils from '../utils'
import * as storage from '../storage'
import * as eventUtils from './utils'
import * as network from '../common/networkUtil'
import { syncPreviousDateEvents, syncPreviousEvents } from './'

window.fetch = require('node-fetch')
beforeAll(() => jest.spyOn(window, 'fetch'))

let spyDate
let spySet
let spySession
beforeEach(() => {
  spyDate = jest
    .spyOn(utils, 'getDate')
    .mockImplementation(() => '20-3-2020')

  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation(() => 124123423)

  spySet = jest
    .spyOn(eventStorage, 'setEventsByDate')
    .mockImplementation()

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spyDate.mockRestore()
  spySet.mockRestore()
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('syncPreviousEvents', () => {
  let spyPost

  beforeEach(() => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    spyPost.mockRestore()
  })

  it('null', () => {
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('same session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              sentToServer: false
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('nothing to sync, only session will be sent', () => {
    const spyApproximate = jest
      .spyOn(utils, 'shouldApproximateTimestamp')
      .mockImplementation(() => true)

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledWith('', '{"events":[{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775121800,"properties":{"referrer":null,"screen":{},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyApproximate.mockRestore()
  })

  it('do not collect system events', () => {
    const spySystem = jest
      .spyOn(eventUtils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spySystem.mockRestore()
    spyEvents.mockRestore()
  })

  it('few events', () => {
    const spyCount = jest
      .spyOn(utils, 'getSystemMergeCounter')
      .mockImplementation(() => 2)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536
              }
            ],
            startTime: 1231312321,
            endTime: 0,
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init'
                },
                {
                  sentToServer: false,
                  name: 'load'
                },
                {
                  sentToServer: false,
                  name: 'click'
                }
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false,
                  name: 'custom_event'
                }
              ]
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"init","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evn":"load","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evn":"custom_event","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"click","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775120000,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213","start":1231312321,"end":0,"duration":0},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('payload is empty', () => {
    const spyPayload = jest
      .spyOn(eventUtils, 'getEventPayloadArr')
      .mockImplementation(() => [])
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536
              }
            ],
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init'
                },
                {
                  sentToServer: false,
                  name: 'load'
                },
                {
                  sentToServer: false,
                  name: 'click'
                }
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false
                }
              ]
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
    spyPayload.mockRestore()
  })
})

describe('syncPreviousDateEvents', () => {
  let spyPost

  beforeEach(() => {
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    spyPost.mockRestore()
  })

  it('null', () => {
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('nothing to sync, only session will be sent', () => {
    const spyApproximate = jest
      .spyOn(utils, 'shouldApproximateTimestamp')
      .mockImplementation(() => true)

    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true
            }
          }
        }
      }))
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledWith('', '{"events":[{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775121800,"properties":{"referrer":null,"screen":{},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyApproximate.mockRestore()
  })

  it('do not collect system events', () => {
    const spySystem = jest
      .spyOn(eventUtils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            eventsData: {
              sentToServer: true
            }
          }
        }
      }))
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledTimes(0)
    spySystem.mockRestore()
    spyEvents.mockRestore()
  })

  it('few events', () => {
    const spyCount = jest
      .spyOn(utils, 'getSystemMergeCounter')
      .mockImplementation(() => 2)
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536
              }
            ],
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init'
                },
                {
                  sentToServer: false,
                  name: 'load'
                },
                {
                  sentToServer: false,
                  name: 'click'
                }
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false,
                  name: 'custom_event'
                }
              ]
            }
          }
        }
      }))
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"init","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evn":"load","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evn":"custom_event","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"click","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775120000,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('payload is empty', () => {
    const spyPayload = jest
      .spyOn(eventUtils, 'getEventPayloadArr')
      .mockImplementation(() => [])
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          12341234213: {
            viewPort: [
              {
                timeStamp: 1608506665536
              }
            ],
            eventsData: {
              sentToServer: false,
              eventsInfo: [
                {
                  sentToServer: false,
                  name: 'init'
                },
                {
                  sentToServer: false,
                  name: 'load'
                },
                {
                  sentToServer: false,
                  name: 'click'
                }
              ],
              devCodifiedEventsInfo: [
                {
                  sentToServer: false,
                  isPii: false,
                  isPhi: false
                }
              ]
            }
          }
        }
      }))
    syncPreviousDateEvents()
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
    spyPayload.mockRestore()
  })
})
