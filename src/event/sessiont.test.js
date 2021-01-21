import * as eventStorage from './storage'
import * as storage from '../storage'
import * as utils from '../utils'
import * as timeUtil from '../common/timeUtil'
import * as storageStore from '../storage/store'
import {
  createEventInfoObj,
  getPreviousDateData,
  getSessionForDate,
  setDevEvent,
  setEndDevEvent,
  setEvent,
  setSessionForDate,
  setStartDevEvent
} from './session'

let spyDate
let spySet
let spySession
beforeEach(() => {
  spyDate = jest
    .spyOn(timeUtil, 'getStringDate')
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
                  mousePosX: -1,
                  mousePosY: -1
                },
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
                evc: 20001,
                evcs: 24146,
                mid: 'localhost-null-1580775120000',
                name: 'some_event',
                nmo: 1,
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
                evc: 20001,
                evcs: 24146,
                mid: 'localhost-null-1580775120000',
                name: 'some_event',
                nmo: 1,
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

  it('no session', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => null)
    setStartDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(1)
  })

  it('new event', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '')
    setStartDevEvent('some_event')
    expect(spySetSession).toBeCalledWith('startEvents', '[{"sentToServer":false,"urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146,"name":"some_event"}]')
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

  it('no session', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => null)
    setEndDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
  })

  it('event did not start yet', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"sentToServer":false,"name":"different_event","urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146}]')
    setEndDevEvent('some_event')
    expect(spySetSession).toBeCalledTimes(0)
    expect(spySet).toBeCalledTimes(0)
  })

  it('sdk is null', () => {
    spySession = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => '[{"sentToServer":false,"name":"different_event","urlPath":"http://localhost/","tstmp":1580775120000,"mid":"localhost-null-1580775120000","nmo":1,"evc":20001,"evcs":24146}]')
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

describe('getSessionForDate', () => {
  it('null', () => {
    const result = getSessionForDate()
    expect(result).toBeNull()
  })

  it('date do not exists', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)

    const result = getSessionForDate('21-3-2020', 124123423)
    expect(result).toBeNull()
    spyEvents.mockRestore()
  })

  it('sessions do not exist', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))

    const result = getSessionForDate('20-3-2020', 124123423)
    expect(result).toBeNull()
    spyEvents.mockRestore()
  })

  it('session do not exist', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))

    const result = getSessionForDate('20-3-2020', 124123423)
    expect(result).toBeNull()
    spyEvents.mockRestore()
  })

  it('provided session', () => {
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

    const result = getSessionForDate('20-3-2020', 24123423)
    expect(result).toBeNull()
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

    const result = getSessionForDate('20-3-2020', 124123423)
    expect(result).toStrictEqual({
      eventsData: {
        devCodifiedEventsInfo: []
      }
    })
    spyEvents.mockRestore()
  })
})

describe('setSessionForDate', () => {
  it('null', () => {
    setSessionForDate()
    expect(spySet).toBeCalledTimes(0)
  })

  it('data is null', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    setSessionForDate('20-03-2020', 124123423, { data: true })
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('sessions is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    setSessionForDate('20-03-2020', 124123423, { data: true })
    expect(spySet).toBeCalledTimes(0)
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
    setSessionForDate('20-03-2020', 124123423, { data: true })
    expect(spySet).toBeCalledWith('20-03-2020', {
      sessions: {
        124123423: {
          data: true
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('getPreviousDateData', () => {
  let spyDate
  beforeEach(() => {
    spyDate = jest
      .spyOn(utils, 'getNotSyncedDate')
      .mockImplementation()
  })

  afterEach(() => {
    spyDate.mockRestore()
  })

  it('null', () => {
    const result = getPreviousDateData()
    expect(result).toBeNull()
  })

  it('sessions is missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({}))
    const result = getPreviousDateData()
    expect(result).toBeNull()
    spyEvents.mockRestore()
  })

  it('nothing to sync', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              sentToServer: true
            }
          }
        }
      }))
    const result = getPreviousDateData()
    expect(result).toBeNull()
    spyEvents.mockRestore()
  })

  it('sync', () => {
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
    const result = getPreviousDateData()
    expect(result).toStrictEqual({
      sentToServer: false
    })
    spyEvents.mockRestore()
  })
})

describe('createEventInfoObj', () => {
  it('null', () => {
    const result = createEventInfoObj()
    expect(result).toBeNull()
  })

  it('ok', () => {
    const result = createEventInfoObj(
      'some_event',
      'name',
      {
        target: {
        }
      })
    expect(result).toStrictEqual({
      evc: 10001,
      evcs: undefined,
      extraInfo: {
        mousePosX: -1,
        mousePosY: -1
      },
      name: 'some_event',
      nmo: 1,
      objectName: 'name',
      objectTitle: '',
      position: {
        height: -1, width: -1, x: -1, y: -1
      },
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/'
    })
  })

  it('with mid', () => {
    const spyStore = jest
      .spyOn(storageStore, 'getRoot')
      .mockImplementation(() => ({}))

    const result = createEventInfoObj(
      'some_event',
      'name',
      {
        target: {
          offsetHeight: 10,
          offsetWidth: 10
        },
        screenX: 1024,
        offsetX: 10,
        screenY: 768,
        offsetY: 5
      })
    expect(result).toStrictEqual({
      evc: 10001,
      evcs: undefined,
      extraInfo: {
        mousePosX: -1,
        mousePosY: -1
      },
      mid: 'localhost-null-1580775120000',
      name: 'some_event',
      nmo: 1,
      objectName: 'name',
      objectTitle: '',
      position: {
        height: 10,
        width: 10,
        x: 1014,
        y: 763
      },
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/'
    })
    spyStore.mockRestore()
  })
})
