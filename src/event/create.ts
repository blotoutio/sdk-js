import { codeForDevEvent } from './utils'
import { getMid } from '../common/utils'
import { systemEventCode } from '../common/config'

const getObjectTitle = (event, eventName) => {
  if (
    eventName !== 'click' &&
    eventName !== 'mouseover' &&
    eventName !== 'hover' &&
    eventName !== 'dblclick'
  ) {
    return ''
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

  if (event.target && event.target.localName) {
    const elmIndex = elmArr.findIndex((el) => el === event.target.localName)
    if (elmIndex !== -1) {
      return event.target.innerText
    }

    if (
      event.target.firstElementChild &&
      event.target.firstElementChild.localName !== 'head'
    ) {
      return event.target.firstElementChild.innerText
    }
  } else if (event.target && event.target.querySelector) {
    const h1 = event.target.querySelector('h1')
    if (h1 && h1.innerText) {
      return h1.innerText
    }

    const h2 = event.target.querySelector('h2')
    if (h2 && h2.innerText) {
      return h2.innerText
    }

    const h3 = event.target.querySelector('h3')
    if (h3 && h3.innerText) {
      return h3.innerText
    }

    const h4 = event.target.querySelector('h4')
    if (h4 && h4.innerText) {
      return h4.innerText
    }

    const h5 = event.target.querySelector('h5')
    if (h5 && h5.innerText) {
      return h5.innerText
    }

    const h6 = event.target.querySelector('h6')
    if (h6 && h6.innerText) {
      return h6.innerText
    }
  }
}

export const createPosition = (event) => {
  let height = -1
  let width = -1
  if (event && event.target) {
    if (event.target.offsetHeight) {
      height = event.target.offsetHeight
    }

    if (event.target.offsetWidth) {
      width = event.target.offsetWidth
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

export const createDevEvent = (event) => {
  if (!event || !event.name) {
    return null
  }

  const devEvent = {
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    evcs: event.code || codeForDevEvent(event.name),
    name: event.name,
  }

  if (event.data) {
    devEvent.metaInfo = event.data
  }

  return devEvent
}

export const createEvent = (eventName, objectName, event) => {
  if (!eventName) {
    return null
  }

  const data = {
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    evcs: systemEventCode[eventName],
    mid: getMid(),
  }

  if (event) {
    data.position = createPosition(event)
    data.objectTitle = getObjectTitle(event, eventName)

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
