import { dragStart, dragEnd } from './dragdrop'
import { copy, cut, paste } from './clipboard'
import { blur, focus } from './focus'
import { reset, submit } from './form'
import { keyPressed, keyDown } from './keyboard'
import { click, doubleClick, contextMenu, hover } from './mouse'
import { online, offline } from './network'
import { print } from './print'
import { touchEnd } from './touch'
import { hashChange } from './hash'
import { pagehide, domActive, domSubTreeModified, scroll } from './window'
import { error } from './resource'
import { shouldCollectSystemEvents } from '../utils'

export const optionalEvents = (window: Window): void => {
  if (!shouldCollectSystemEvents()) {
    return
  }

  dragStart(window)
  dragEnd(window)

  copy(window)
  cut(window)
  paste(window)

  blur(window)
  focus(window)

  reset(window)
  submit(window)

  keyPressed(window)
  keyDown(window)

  click(window)
  doubleClick(window)
  contextMenu(window)
  hover(window)

  print(window)

  touchEnd(window)

  hashChange(window)

  domActive(window)
  domSubTreeModified(window)
  scroll(window)

  error(window)
}

export const requiredEvents = (window: Window): void => {
  pagehide(window)

  online(window)
  offline(window)
}
