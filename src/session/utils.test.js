import { checkAndGetSessionId, eventSync, getNotSynced, maybeSync } from './utils'
import * as storage from '../storage'
import * as utils from '../utils'

describe('eventSync', () => {
  beforeEach(() => {
    eventSync.progressStatus = false
  })

  it('default', () => {
    const result = eventSync.inProgress
    expect(result).toBe(false)
  })

  it('set/get', () => {
    expect(eventSync.progressStatus).toBe(false)
    eventSync.progressStatus = true
    expect(eventSync.progressStatus).toBe(true)
  })
})

describe('checkAndGetSessionId', () => {
  it('session do no exist yet', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
    const id = 1580775120000
    const spySet = jest
      .spyOn(storage, 'setSession')
      .mockImplementation()

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    expect(spySet).toHaveBeenCalledWith('sessionId', id)
    expect(spySet).toHaveBeenCalledWith('session_start_time', id)
    spySet.mockRestore()
    jest.useRealTimers()
  })

  it('session exists', () => {
    const id = Date.now()
    const spyGet = jest
      .spyOn(storage, 'getSession')
      .mockImplementation(() => id)

    const result = checkAndGetSessionId()
    expect(result).toBe(id)
    spyGet.mockRestore()
  })
})

describe('getNotSynced', () => {
  it('null', () => {
    const result = getNotSynced()
    expect(result).toBe(null)
  })

  it('event data missing', () => {
    const result = getNotSynced({
      23423423: {}
    })
    expect(result).toBe(null)
  })

  it('session in between was missed', () => {
    const result = getNotSynced({
      23423423: {
        eventsData: {
          sentToServer: true
        }
      },
      23423424: {
        eventsData: {
          sentToServer: false
        }
      },
      23423425: {
        eventsData: {
          sentToServer: true
        }
      }
    })
    expect(result).toBe('23423424')
  })

  it('last session', () => {
    const result = getNotSynced({
      23423423: {
        eventsData: {
          sentToServer: true
        }
      },
      23423424: {
        eventsData: {
          sentToServer: false
        }
      }
    })
    expect(result).toBe('23423424')
  })
})

describe('maybeSync', () => {
  let spySync

  beforeEach(() => {
    spySync = jest
      .spyOn(utils, 'syncEvents')
      .mockImplementation()
    eventSync.progressStatus = false
  })

  afterEach(() => {
    spySync.mockRestore()
  })

  it('null', () => {
    maybeSync()
    expect(spySync).toBeCalledTimes(0)
  })

  it('missing devCodifiedEventsInfo', () => {
    maybeSync({
      eventsInfo: []
    })
    expect(spySync).toBeCalledTimes(0)
    expect(eventSync.progressStatus).toBe(false)
  })

  it('event push, no sync in progress', () => {
    const spyManifest = jest
      .spyOn(utils, 'getManifestVariable')
      .mockImplementation(() => 1)
    maybeSync({
      eventsInfo: [
        {
          sentToServer: false
        }
      ],
      devCodifiedEventsInfo: [
        {
          sentToServer: false
        },
        {
          sentToServer: false
        }
      ]
    })
    expect(spySync).toBeCalledTimes(1)
    expect(eventSync.progressStatus).toBe(true)
    spyManifest.mockRestore()
  })
})
