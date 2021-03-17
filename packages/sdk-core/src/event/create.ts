import { codeForDevEvent } from './utils'
import { getMid } from '../common/utils'
import { systemEventCode } from '../common/config'
import type { DevEvent, IncomingEvent, Position, SystemEvent } from '../typings'

const getObjectTitle = (target: HTMLElement) => {
  if (!target || !target.localName) {
    return null
  }

  const elmArr = ['a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  const name = target.localName.toLocaleLowerCase()
  const elmIndex = elmArr.findIndex((el) => el === name)
  if (elmIndex !== -1) {
    return target.innerText
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
    const title = getObjectTitle(event.target as HTMLElement)
    if (title) {
      data.objectTitle = title
    }

    data.mouse = {
      x: event.clientX || -1,
      y: event.clientY || -1,
    }
  }

  if (objectName) {
    data.objectName = objectName
  }

  return data
}
