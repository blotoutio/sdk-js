import * as storage from '../storage'
import { createEventInfoObj } from './session'

let spySession
beforeEach(() => {
  spySession = jest
    .spyOn(storage, 'getSession')
    .mockImplementation((name) => 124123423)

  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

afterEach(() => {
  spySession.mockRestore()
  jest.useRealTimers()
})

describe('createEventInfoObj', () => {
  it('null', () => {
    const result = createEventInfoObj()
    expect(result).toBeNull()
  })

  it('ok', () => {
    const result = createEventInfoObj('some_event', 'name', {
      target: {},
    })
    expect(result).toStrictEqual({
      evcs: undefined,
      extraInfo: {
        mousePosX: -1,
        mousePosY: -1,
      },
      mid: 'localhost-null-1580775120000',
      name: 'some_event',
      objectName: 'name',
      objectTitle: '',
      position: {
        height: -1,
        width: -1,
        x: -1,
        y: -1,
      },
      sentToServer: false,
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })
})
