import { codeForDevEvent } from './utils'
import { getMid } from '../common/utils'
import { systemEventCode } from '../common/config'

const getObjectTitle = (target: HTMLElement, eventName: string) => {
  if (!target) {
    return null
  }

  if (
    eventName !== 'click' &&
    eventName !== 'mouseover' &&
    eventName !== 'hover' &&
    eventName !== 'dblclick'
  ) {
    return null
  }

  const elmArr = [
    'a',
    'A',
    'button',
    'BUTTON',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ]

  if (target.localName) {
    const elmIndex = elmArr.findIndex((el) => el === target.localName)
    if (elmIndex !== -1) {
      return target.innerText
    }
  }

  if (target.querySelector) {
    const h1 = target.querySelector('h1')
    if (h1 && h1.innerText) {
      return h1.innerText
    }

    const h2 = target.querySelector('h2')
    if (h2 && h2.innerText) {
      return h2.innerText
    }

    const h3 = target.querySelector('h3')
    if (h3 && h3.innerText) {
      return h3.innerText
    }

    const h4 = target.querySelector('h4')
    if (h4 && h4.innerText) {
      return h4.innerText
    }

    const h5 = target.querySelector('h5')
    if (h5 && h5.innerText) {
      return h5.innerText
    }

    const h6 = target.querySelector('h6')
    if (h6 && h6.innerText) {
      return h6.innerText
    }
  }

  return null
}

export const createPosition = (event: MouseEvent): null | Position => {
  if (!event) {
    return null
  }

  let height = -1
  let width = -1
  if (event && event.target) {
    const target = event.target as HTMLElement
    if (target.offsetHeight) {
      height = target.offsetHeight
    }

    if (target.offsetWidth) {
      width = target.offsetWidth
    }
  }

  let x = -1
  let y = -1
  if (event.screenX != null && event.offsetX != null) {
    x = event.screenX - event.offsetX
  }

  if (event.screenY != null && event.offsetY != null) {
    y = event.screenY - event.offsetY
  }

  return { x, y, width, height }
}

export const createDevEvent = (event: IncomingEvent): DevEvent => {
  if (!event || !event.name) {
    return null
  }

  const devEvent: DevEvent = {
    name: event.name,
    urlPath: window.location.href,
    mid: getMid(),
    tstmp: Date.now(),
    evcs: event.code || codeForDevEvent(event.name),
  }

  if (event.data) {
    devEvent.metaInfo = event.data
  }

  return devEvent
}

export const createEvent = (
  eventName: string,
  objectName?: string,
  event?: MouseEvent
): SystemEvent => {
  if (!eventName) {
    return null
  }

  const data: SystemEvent = {
    name: eventName,
    urlPath: window.location.href,
    mid: getMid(),
    tstmp: Date.now(),
    evcs: systemEventCode[eventName],
  }

  if (event) {
    data.position = createPosition(event as MouseEvent)
    data.objectTitle = getObjectTitle(event.target as HTMLElement, eventName)

    if (
      event.name === 'click' ||
      event.name === 'mouseover' ||
      event.name === 'hover' ||
      event.name === 'dblclick'
    ) {
      data.mouse = {
        x: event.clientX || -1,
        y: event.clientY || -1,
      }
    }
  }

  if (objectName) {
    data.objectName = objectName
  }

  return data
}
