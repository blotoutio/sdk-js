import type { IncomingEvent } from '../typings'
import { createEvent, createPosition } from './create'
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

describe('createEvent', () => {
  it('null', () => {
    expect(createEvent(null)).toBeNull()
  })

  it('empty string', () => {
    expect(createEvent({ name: '' })).toBeNull()
  })

  it('basic', () => {
    expect(createEvent({ name: 'click', code: 11119 })).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('basic with custom url', () => {
    expect(
      createEvent({ name: 'click', url: 'https://blotout.io/', code: 11119 })
    ).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      tstmp: 1580775120000,
      urlPath: 'https://blotout.io/',
    })
  })

  it('click with h1', () => {
    const target = document.createElement('h1')
    target.innerText = 'hi'

    const event = new MouseEvent('click', {
      screenX: 10,
      screenY: 20,
    })
    Object.defineProperty(event, 'target', {
      value: target,
    })

    expect(
      createEvent({
        name: 'click',
        code: 11119,
        objectName: 'someObject',
        event,
      })
    ).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      objectName: 'someObject',
      objectTitle: 'hi',
      position: { height: -1, width: -1, x: -1, y: -1 },
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
      mouse: {
        x: -1,
        y: -1,
      },
    })
  })

  it('click with div', () => {
    const target = document.createElement('div')
    target.innerText = 'no'

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })

    expect(
      createEvent({
        name: 'click',
        code: 11119,
        objectName: 'someObject',
        event,
      })
    ).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'click',
      objectName: 'someObject',
      position: { height: -1, width: -1, x: -1, y: -1 },
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
      mouse: {
        x: -1,
        y: -1,
      },
    })
  })

  it('hover', () => {
    const event = new MouseEvent('hover', {
      screenX: 10,
      screenY: 20,
    })

    Object.defineProperty(event, 'target', {
      value: null,
    })

    expect(
      createEvent({
        name: 'hover',
        code: 11508,
        objectName: 'someObject',
        event,
      })
    ).toStrictEqual({
      evcs: 11508,
      mid: 'aG92ZXI=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      mouse: { x: -1, y: -1 },
      name: 'hover',
      objectName: 'someObject',
      position: { height: -1, width: -1, x: -1, y: -1 },
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('local name is missing', () => {
    const target = document.createElement('div')
    target.innerText = 'no'

    Object.defineProperty(target, 'localName', {
      value: null,
    })

    const event = new MouseEvent('click')
    Object.defineProperty(event, 'target', {
      value: target,
    })

    expect(
      createEvent({
        name: 'click',
        code: 11119,
        objectName: 'someObject',
        event,
      })
    ).toStrictEqual({
      evcs: 11119,
      mid: 'Y2xpY2s=-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      mouse: { x: -1, y: -1 },
      name: 'click',
      objectName: 'someObject',
      position: { height: -1, width: -1, x: -1, y: -1 },
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('no additional data', () => {
    const event: IncomingEvent = {
      name: 'custom-event',
    }

    expect(createEvent(event)).toStrictEqual({
      evcs: 23872,
      mid:
        'Y3VzdG9tLWV2ZW50-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'custom-event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
    })
  })

  it('with additional data', () => {
    const event: IncomingEvent = {
      name: 'custom-event',
      data: {
        foo: true,
      },
    }

    expect(createEvent(event)).toStrictEqual({
      evcs: 23872,
      mid:
        'Y3VzdG9tLWV2ZW50-43cf2386-1285-445c-8633-d7555d6e2f35-1580775120000',
      name: 'custom-event',
      tstmp: 1580775120000,
      urlPath: 'http://localhost/',
      metaInfo: {
        foo: true,
      },
    })
  })
})
