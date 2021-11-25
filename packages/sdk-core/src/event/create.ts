import { getMid } from '../common/utils'
import type { BasicEvent, IncomingEvent, Position } from '../typings'

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

export const createBasicEvent = (event: IncomingEvent): BasicEvent => {
  if (!event || !event.name) {
    return null
  }

  return {
    name: event.name,
    urlPath: event.url || window.location.href,
    mid: getMid(event.name),
    tstmp: Date.now(),
  }
}
