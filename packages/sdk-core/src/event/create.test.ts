import { createBasicEvent, createPosition } from './create'
jest.mock('uuid', () => ({ v4: () => '43cf2386-1285-445c-8633-d7555d6e2f35' }))

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('04 Feb 2020 00:12:00 GMT').getTime())
})

describe('createPosition', () => {
  it('null', () => {
    expect(createPosition(null)).toBeNull()
  })

  it('basic event', () => {
    const event = new MouseEvent('click')
    expect(createPosition(event)).toStrictEqual({
      height: -1,
      width: -1,
      x: -1,
      y: -1,
    })
  })

  it('basic event', () => {
    const event = new MouseEvent('click')
    const target = document.createElement('div')

    Object.defineProperty(event, 'target', {
      value: target,
    })
    expect(createPosition(event)).toStrictEqual({
      height: -1,
      width: -1,
      x: -1,
      y: -1,
    })
  })

  it('with more data', () => {
    const event = new MouseEvent('click', {
      screenX: 10,
      screenY: 20,
    })
    Object.defineProperty(event, 'offsetX', {
      value: 30,
    })
    Object.defineProperty(event, 'offsetY', {
      value: 50,
    })

    const target = document.createElement('div')
    Object.defineProperty(target, 'offsetHeight', {
      value: 30,
    })
    Object.defineProperty(target, 'offsetWidth', {
      value: 50,
    })

    Object.defineProperty(event, 'target', {
      value: target,
    })
    expect(createPosition(event)).toStrictEqual({
      height: 30,
      width: 50,
      x: -20,
      y: -30,
    })
  })
})

describe('createBasicEvent', () => {
  it('null', () => {
    expect(createBasicEvent(null)).toBeNull()
  })

  it('empty string', () => {
    expect(createBasicEvent({ name: '' })).toBeNull()
  })

  it('basic', () => {
    expect(createBasicEvent({ name: 'click', code: 11119 })).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('basic with custom url', () => {
    expect(
      createBasicEvent({
        name: 'click',
        url: 'https://blotout.io/',
        code: 11119,
      })
    ).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      tstmp: 1580775120000,
      urlPath: 'https://blotout.io/',
    })
  })
})
