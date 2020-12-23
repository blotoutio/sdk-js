import * as eventStorage from '../event/storage'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { resetPreviousDate, setReferrerEvent, updateNavPath, updateNavTime } from './navigation'

let spyDate
let spySet
let spySession
beforeEach(() => {
  spyDate = jest
    .spyOn(timeUtil, 'getStringDate')
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

describe('updateNavTime', () => {
  it('null', () => {
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no navPaths', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {}
          }
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('last path is different then saved', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://domain.com/'
              ],
              stayTimeBeforeNav: [
                10,
                30
              ]
            }
          }
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: [
              'http://domain.com/'
            ],
            stayTimeBeforeNav: [
              10,
              30,
              1580650956
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })

  it('last path is different then saved, no stay time recorded', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://domain.com/'
              ],
              stayTimeBeforeNav: []
            }
          }
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: [
              'http://domain.com/'
            ],
            stayTimeBeforeNav: [
              1580650996
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })

  it('same path, no stay time recorded', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://localhost/'
              ],
              stayTimeBeforeNav: []
            }
          }
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: [
              'http://localhost/'
            ],
            stayTimeBeforeNav: [
              1580650996
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })

  it('same path, no stay time recorded', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://localhost/'
              ],
              stayTimeBeforeNav: [
                20,
                40
              ]
            }
          }
        }
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: [
              'http://localhost/'
            ],
            stayTimeBeforeNav: [
              20,
              1580650936
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('updateNavPath', () => {
  it('null', () => {
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no navigationPath', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {}
          }
        }
      }))
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('navigationPath empty', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: []
            }
          }
        }
      }))
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('same path empty', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://localhost/'
              ]
            }
          }
        }
      }))
    updateNavPath()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('different path empty', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: [
                'http://domain.com/'
              ]
            }
          }
        }
      }))
    updateNavPath()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: [
              'http://domain.com/',
              'http://localhost/'
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('setReferrerEvent', () => {
  it('null', () => {
    setReferrerEvent()
    expect(spySet).toBeCalledTimes(0)
  })

  it('no sessions', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no session', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {}
      }))
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no eventsData', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {}
        }
      }))
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('no eventsInfo', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {}
          }
        }
      }))
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('event found', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              eventsInfo: [{
                name: 'some_event'
              }]
            }
          }
        }
      }))
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('event not found', () => {
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
    setReferrerEvent('some_event')
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            eventsInfo: [
              {
                evc: 10001,
                evcs: undefined,
                metaInfo: {},
                mid: 'localhost-null-1580775120000',
                name: 'some_event',
                nmo: 1,
                objectName: '',
                objectTitle: '',
                position: {
                  height: -1,
                  width: -1,
                  x: -1,
                  y: -1
                },
                sentToServer: false,
                tstmp: 1580775120000,
                urlPath: 'http://localhost/',
                value: undefined
              }
            ]
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})

describe('resetPreviousDate', () => {
  it('sdk data missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => null)
    resetPreviousDate()
    spyEvents.mockRestore()
  })

  it('sessions missing', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => {})
    resetPreviousDate()
    spyEvents.mockRestore()
  })

  it('everything is already synced', () => {
    const data = {
      sessions: {
        234234234242: {
          eventsData: {
            sentToServer: true
          }
        },
        2342342342342: {}
      }
    }
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => data)
    resetPreviousDate()
    expect(data).toStrictEqual(data)
    spyEvents.mockRestore()
  })

  it('session not synced', () => {
    const data = {
      sessions: {
        234234234242: {
          eventsData: {
            navigationPath: [
              'http://domain.com/'
            ],
            stayTimeBeforeNav: [
              5
            ],
            sentToServer: false
          }
        }
      }
    }
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => data)
    resetPreviousDate()
    expect(data).toStrictEqual({
      sessions: {
        234234234242: {
          eventsData: {
            navigationPath: [],
            sentToServer: false,
            stayTimeBeforeNav: []
          }
        }
      }
    })
    spyEvents.mockRestore()
  })
})
