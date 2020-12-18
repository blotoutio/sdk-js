import * as eventStorage from '../storage/event'
import * as storage from '../storage'
import * as utils from '../utils'
import { setDevEvent, setEndDevEvent, setEvent, setStartDevEvent } from './event'

let spyDate
let spySet
let spySession
beforeEach(() => {
  spyDate = jest
    .spyOn(utils, 'getDate')
    .mockImplementation(() => '20-3-2020')

  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation((name) => 124123423)

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

describe('setEvent', () => {
  it('null', () => {
    setEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('create new date', () => {
    const spyStore = jest
      .spyOn(eventStorage, 'getStore')
      .mockImplementation(() => ({}))
    const spyNew = jest
      .spyOn(utils, 'setNewDateObject')
      .mockImplementation()
    setEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    expect(spyNew).toBeCalledTimes(1)
    spyStore.mockRestore()
    spyNew.mockRestore()
  })

  it('session is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    setEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('session id is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    setEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('event data is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    setEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('eventsInfo missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: []
          }
        }
      }))
    setEvent('some_event')
    expect(spySet).toBeCalledTimes(1)
    spyEvents.mockRestore()
  })

  it('ok', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              eventsInfo: []
            }
          }
        }
      }))
    setEvent(
      'some_event', {
        event: {
          target: '#id'
        }
      },
      {
        data: true
      })
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            eventsInfo: [
              {
                evc: 10001,
                evcs: undefined,
                extraInfo: {
                  mousePosX: undefined,
                  mousePosY: undefined
                },
                metaInfo: {
                  data: true
                },
                mid: '',
                name: 'some_event',
                nmo: 1,
                objectName: 'Unknown',
                objectTitle: '',
                position: {
                  height: -1,
                  width: -1,
                  x: -1,
                  y: -1
                },
                sentToServer: false,
                tstmp: 1580775120000,
                urlPath: 'http://localhost/'
              }
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('setDevEvent', () => {
  it('null', () => {
    setDevEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('session is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    setDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('session id is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    setDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('event data is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    setDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('devCodifiedEventsInfo not set', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {}
          }
        }
      }))
    setDevEvent('some_event')
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            devCodifiedEventsInfo: [
              {
                duration: null,
                evc: 20001,
                evcs: 24146,
                isPhi: false,
                isPii: false,
                metaInfo: undefined,
                mid: 'localhost-null-1580775120000',
                name: 'some_event',
                nmo: 1,
                objectName: undefined,
                sentToServer: false,
                tstmp: 1580775120000,
                urlPath: 'http://localhost/'
              }
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })

  it('ok', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              devCodifiedEventsInfo: []
            }
          }
        }
      }))
    setDevEvent('some_event')
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            devCodifiedEventsInfo: [
              {
                duration: null,
                evc: 20001,
                evcs: 24146,
                isPhi: false,
                isPii: false,
                metaInfo: undefined,
                mid: 'localhost-null-1580775120000',
                name: 'some_event',
                nmo: 1,
                objectName: undefined,
                sentToServer: false,
                tstmp: 1580775120000,
                urlPath: 'http://localhost/'
              }
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('setStartDevEvent', () => {
  let spySetSession
  beforeEach(() => {
    spySetSession = jest
      .spyOn(storage, 'setSession')
      .mockImplementation()
  })

  afterEach(() => {
    spySetSession.mockRestore()
  })

  it('null', () => {
    setStartDevEvent()
    expect(spySetSession).toBeCalledTimes(0)
  })

  it('corrupted JSON', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[')
    setStartDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(1)
  })

  it('new event', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '')
    setStartDevEvent('some_event')
    expect(spySetSession).toBeCalledWith('startEvents', '[{"sentToServer":false,"name":"some_event","urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146,"duration":null,"isPii":false,"isPhi":false}]')
  })

  it('event exists', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => JSON.stringify([
        {
          name: 'some_event',
          startTime: 1231232
        }
      ]))
    setStartDevEvent('some_event')
    expect(spySetSession).toBeCalledWith('startEvents', '[{"name":"some_event","startTime":1580775120000}]')
  })
})

describe('setEndDevEvent', () => {
  let spySetSession
  beforeEach(() => {
    spySetSession = jest
      .spyOn(storage, 'setSession')
      .mockImplementation()
  })

  afterEach(() => {
    spySetSession.mockRestore()
  })

  it('null', () => {
    setEndDevEvent()
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
  })

  it('parsing failed', () => {
    const spyRemove = jest
      .spyOn(storage, 'removeSession')
      .mockImplementation()
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[')
    setEndDevEvent('some_event')
    expect(spyRemove).toBeCalledWith('startEvents')
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
    spyRemove.mockRestore()
  })

  it('event did not start yet', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"sentToServer":false,"name":"different_event","urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146,"duration":null,"isPii":false,"isPhi":false}]')
    setEndDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
  })

  it('sdk is null', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"sentToServer":false,"name":"different_event","urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146,"duration":null,"isPii":false,"isPhi":false}]')
    setEndDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
  })

  it('session is missing', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"name":"some_event","startTime":1580775120000}]')
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    setEndDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('session id is missing', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"name":"some_event","startTime":1580775120000}]')
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    setEndDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    expect(spySetSession).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('event data is missing', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"name":"some_event","startTime":1580775120000}]')
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    setEndDevEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    expect(spySetSession).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('devCodifiedEventsInfo is null', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation((name) => {
        if (name === 'startEvents') {
          return '[{"name":"some_event","startTime":1580775120000,"tstmp":1580775110000}]'
        }

        return 124123423
      })
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {}
          }
        }
      }))
    setEndDevEvent('some_event')
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            devCodifiedEventsInfo: [
              {
                duration: 10,
                name: 'some_event',
                startTime: 1580775120000,
                tstmp: 1580775110000
              }
            ]
          }
        }
      }
    })
    expect(spySetSession).toBeCalledWith('startEvents', '[]')
    spyEvents.mockRestore()
  })

  it('ok', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation((name) => {
        if (name === 'startEvents') {
          return '[{"name":"different_event","startTime":1580775120000,"tstmp":1580775110000},{"name":"some_event","startTime":1580775120000,"tstmp":1580775110000}]'
        }

        return 124123423
      })
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              devCodifiedEventsInfo: []
            }
          }
        }
      }))
    setEndDevEvent('some_event')
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            devCodifiedEventsInfo: [
              {
                duration: 10,
                name: 'some_event',
                startTime: 1580775120000,
                tstmp: 1580775110000
              }
            ]
          }
        }
      }
    })
    expect(spySetSession).toBeCalledWith('startEvents', '[{"name":"different_event","startTime":1580775120000,"tstmp":1580775110000}]')
    spyEvents.mockRestore()
  })
})
