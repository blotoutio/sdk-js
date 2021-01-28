import * as eventStorage from '../event/storage'
import * as storage from '../storage'
import * as timeUtil from '../common/timeUtil'
import { resetPreviousDate, updateNavPath, updateNavTime } from './navigation'

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

  spySet = jest.spyOn(eventStorage, 'setEventsByDate').mockImplementation()

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
        sessions: {},
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
          124123423: {},
        },
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
            eventsData: {},
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledTimes(0)
    spyEvents.mockRestore()
  })

  it('single path is saved', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: ['http://domain.com/'],
              stayTimeBeforeNav: [1580794568000],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://domain.com/'],
            stayTimeBeforeNav: [1580775120000],
          },
        },
      },
    })
    spyEvents.mockRestore()
  })

  it('last path is similar', () => {
    const url = 'http://localhost/'
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
        hostname: 'localhost',
      },
    })
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: ['http://localhost/test', 'http://localhost/'],
              stayTimeBeforeNav: [1580794568000, 1580794688000],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://localhost/test', 'http://localhost/'],
            stayTimeBeforeNav: [1580794568000, 1580775120000],
          },
        },
      },
    })
    spyEvents.mockRestore()
  })

  it('multiple paths are saved and last path is different', () => {
    const url = 'http://localhost/'
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
        hostname: 'localhost',
      },
    })
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: ['http://localhost/', 'http://localhost/test'],
              stayTimeBeforeNav: [1580794568000],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://localhost/', 'http://localhost/test'],
            stayTimeBeforeNav: [1580794568000, 1580775120000],
          },
        },
      },
    })
    spyEvents.mockRestore()
  })

  it('last path is different then saved', () => {
    const spyEvents = jest
      .spyOn(eventStorage, 'getEventsByDate')
      .mockImplementation(() => ({
        sessions: {
          124123423: {
            eventsData: {
              navigationPath: ['http://domain.com/'],
              stayTimeBeforeNav: [1580794568000, 1580794688000],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://domain.com/'],
            stayTimeBeforeNav: [1580794568000, 1580775120000],
          },
        },
      },
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
              navigationPath: ['http://domain.com/'],
              stayTimeBeforeNav: [],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://domain.com/'],
            stayTimeBeforeNav: [1580775120000],
          },
        },
      },
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
              navigationPath: ['http://localhost/'],
              stayTimeBeforeNav: [],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://localhost/'],
            stayTimeBeforeNav: [1580775120000],
          },
        },
      },
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
              navigationPath: ['http://localhost/'],
              stayTimeBeforeNav: [1580794688000, 1580794808000],
            },
          },
        },
      }))
    updateNavTime()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://localhost/'],
            stayTimeBeforeNav: [1580794688000, 1580775120000],
          },
        },
      },
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
        sessions: {},
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
          124123423: {},
        },
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
            eventsData: {},
          },
        },
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
              navigationPath: [],
            },
          },
        },
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
              navigationPath: ['http://localhost/'],
            },
          },
        },
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
              navigationPath: ['http://domain.com/'],
            },
          },
        },
      }))
    updateNavPath()
    expect(spySet).toBeCalledWith('20-3-2020', {
      sessions: {
        124123423: {
          eventsData: {
            navigationPath: ['http://domain.com/', 'http://localhost/'],
          },
        },
      },
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
            sentToServer: true,
          },
        },
        2342342342342: {},
      },
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
            navigationPath: ['http://domain.com/'],
            stayTimeBeforeNav: [5],
            sentToServer: false,
          },
        },
      },
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
            stayTimeBeforeNav: [],
          },
        },
      },
    })
    spyEvents.mockRestore()
  })
})
