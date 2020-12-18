import * as eventStorage from '../storage/event'
import * as storage from '../storage'
import * as utils from '../utils'
import * as network from '../common/networkUtil'
import { syncPreviousEvents, updatePreviousDayEndTime, updateEndTime, syncPreviousDateEvents } from './index'

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

describe('updatePreviousDayEndTime', () => {
  it('null', () => {
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('set endTime', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    updatePreviousDayEndTime()
    expect(spySet).toBeCalledWith('3-2-2020', {
      sessions: {
        124123423: {
          endTime: 1580775120000
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('updateEndTime', () => {
  it('null', () => {
    updateEndTime()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    updateEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    updateEndTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('set endTime', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    updateEndTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          endTime: 1580775120000
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('syncPreviousEvents', () => {
  let spySendPIH
  let spyPost
  let spyNavigation

  beforeEach(() => {
    spySendPIH = jest
      .spyOn(utils, 'sendPIIPHIEvent')
      .mockImplementation()
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
    spyNavigation = jest
      .spyOn(utils, 'sendNavigation')
      .mockImplementation()
  })

  afterEach(() => {
    spySendPIH.mockRestore()
    spyPost.mockRestore()
    spyNavigation.mockRestore()
  })

  it('do not sync', () => {
    const spySync = jest
      .spyOn(utils, 'shouldSyncStoredData')
      .mockImplementation(() => false)
    syncPreviousEvents()
    expect(spySendPIH).toBeCalledTimes(0)
    expect(spyPost).toBeCalledTimes(0)
    spySync.mockRestore()
  })

  it('null', () => {
    syncPreviousEvents()
    expect(spySendPIH).toBeCalledTimes(0)
    expect(spyPost).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    syncPreviousEvents()
    expect(spySendPIH).toBeCalledTimes(0)
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
    expect(spySendPIH).toBeCalledTimes(0)
    expect(spyNavigation).toBeCalledTimes(0)
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
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyPost).toBeCalledWith('', '{"events":[{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775121800,"properties":{"referrer":null,"screen":{},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyApproximate.mockRestore()
  })

  it('do not collect system events', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
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
    expect(spySendPIH).toBeCalledTimes(2)
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
                  isPhi: false
                }
              ]
            }
          }
        }
      }))
    syncPreviousEvents()
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyNavigation).toBeCalledTimes(1)
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"init","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"load","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775120000,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"click","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('payload is empty', () => {
    const spyPayload = jest
      .spyOn(utils, 'getEventPayloadArr')
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
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyNavigation).toBeCalledTimes(1)
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
    spyPayload.mockRestore()
  })
})

describe('syncPreviousDateEvents', () => {
  let spySendPIH
  let spyPost
  let spyNavigation

  beforeEach(() => {
    spySendPIH = jest
      .spyOn(utils, 'sendPIIPHIEvent')
      .mockImplementation()
    spyPost = jest
      .spyOn(network, 'postRequest')
      .mockImplementation(() => Promise.resolve())
    spyNavigation = jest
      .spyOn(utils, 'sendNavigation')
      .mockImplementation()
  })

  afterEach(() => {
    spySendPIH.mockRestore()
    spyPost.mockRestore()
    spyNavigation.mockRestore()
  })

  it('do not sync', () => {
    const spySync = jest
      .spyOn(utils, 'shouldSyncStoredData')
      .mockImplementation(() => false)
    syncPreviousDateEvents()
    expect(spySendPIH).toBeCalledTimes(0)
    expect(spyPost).toBeCalledTimes(0)
    spySync.mockRestore()
  })

  it('null', () => {
    syncPreviousDateEvents()
    expect(spySendPIH).toBeCalledTimes(0)
    expect(spyPost).toBeCalledTimes(0)
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    syncPreviousDateEvents()
    expect(spySendPIH).toBeCalledTimes(0)
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
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyPost).toBeCalledWith('', '{"events":[{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775121800,"properties":{"referrer":null,"screen":{},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    spyEvents.mockRestore()
    spyApproximate.mockRestore()
  })

  it('do not collect system events', () => {
    const spySystem = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
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
    expect(spySendPIH).toBeCalledTimes(2)
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
                  isPhi: false
                }
              ]
            }
          }
        }
      }))
    syncPreviousDateEvents()
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyNavigation).toBeCalledTimes(1)
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"init","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"userid":null,"evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"load","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}},{"mid":"localhost-null-1580775120000","userid":null,"evn":"Session Info","evcs":11024,"evdc":1,"scrn":"http://localhost/","evt":1580775120000,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213","duration":null},"nmo":1,"evc":10001}]}')
    expect(spyPost).toBeCalledWith('', '{"events":[{"userid":null,"evn":"click","evdc":1,"properties":{"referrer":null,"screen":{"timeStamp":1608506665536},"session_id":"12341234213"}}]}')
    spyEvents.mockRestore()
    spyCount.mockRestore()
  })

  it('payload is empty', () => {
    const spyPayload = jest
      .spyOn(utils, 'getEventPayloadArr')
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
    expect(spySendPIH).toBeCalledTimes(2)
    expect(spyNavigation).toBeCalledTimes(1)
    expect(spyPost).toBeCalledTimes(0)
    spyEvents.mockRestore()
    spyPayload.mockRestore()
  })
})
