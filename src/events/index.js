import {
  isSysEvtStore
} from '../config'

import { dragStart, dragEnd } from './dragdrop'
import { copy, cut, paste } from './clipboard'
import { blur, focus } from './focus'
import { reset, submit } from './form'
import { keyPressed, keyDown } from './keyboard'
import { click, doubleClick, contextMenu, mouse } from './mouse'
import { online, offline } from './network'
import { print } from './print'
import { touchEnd } from './touch'
import { hashChange } from './hash'
import { resize, unload, load, beforeUnload, domActive, domSubTreeModified } from './window'
import { error } from './resource'
import { shouldCollectSystemEvents } from '../utils'

export const startEvents = (window) => {
  if (!isSysEvtStore && !shouldCollectSystemEvents()) {
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
  mouse(window)

  online(window)
  offline(window)

  print(window)

  touchEnd(window)

  hashChange(window)

  resize(window)
  unload(window)
  load(window)
  beforeUnload(window)
  domActive(window)
  domSubTreeModified(window)

  error(window)
}
