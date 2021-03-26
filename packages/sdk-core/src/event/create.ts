import { codeForDevEvent } from './utils'
import { getMid } from '../common/utils'
import type { BasicEvent, IncomingEvent, Position } from '../typings'

const getObjectTitle = (element: HTMLElement) => {
  if (!element || !element.localName) {
    return null
  }

  const elmArr = ['a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  const name = element.localName.toLocaleLowerCase()
  const elmIndex = elmArr.findIndex((el) => el === name)
  if (elmIndex !== -1) {
    return element.innerText
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

export const createEvent = (event: IncomingEvent): BasicEvent => {
  if (!event || !event.name) {
    return null
  }

  const data: BasicEvent = {
    name: event.name,
    urlPath: event.url || window.location.href,
    mid: getMid(event.name),
    tstmp: Date.now(),
    evcs: event.code || codeForDevEvent(event.name),
  }

  if (event.data) {
    data.metaInfo = event.data
  }

  if (event.event) {
    data.position = createPosition(event.event as MouseEvent)
    const title = getObjectTitle(event.event.target as HTMLElement)
    if (title) {
      data.objectTitle = title
    }

    data.mouse = {
      x: event.event.clientX || -1,
      y: event.event.clientY || -1,
    }
  }

  if (event.objectName) {
    data.objectName = event.objectName
  }

  return data
}
