import { optionalEvents, requiredEvents } from './index'
import * as dragdrop from './dragdrop'
import * as clipboard from './clipboard'
import * as focus from './focus'
import * as form from './form'
import * as keyboard from './keyboard'
import * as mouse from './mouse'
import * as network from './network'
import * as print from './print'
import * as touch from './touch'
import * as hash from './hash'
import * as windowImport from './window'
import * as resource from './resource'
import * as utils from '../utils'

describe('optionalEvents', () => {
  const spyDragStart = jest.spyOn(dragdrop, 'dragStart')
  const spyDragEnd = jest.spyOn(dragdrop, 'dragEnd')
  const spyCopy = jest.spyOn(clipboard, 'copy')
  const spyCut = jest.spyOn(clipboard, 'cut')
  const spyPaste = jest.spyOn(clipboard, 'paste')
  const spyBlur = jest.spyOn(focus, 'blur')
  const spyFocus = jest.spyOn(focus, 'focus')
  const spyReset = jest.spyOn(form, 'reset')
  const spySubmit = jest.spyOn(form, 'submit')
  const spyKeyPressed = jest.spyOn(keyboard, 'keyPressed')
  const spyKeyDown = jest.spyOn(keyboard, 'keyDown')
  const spyClick = jest.spyOn(mouse, 'click')
  const spyDoubleClick = jest.spyOn(mouse, 'doubleClick')
  const spyContextMenu = jest.spyOn(mouse, 'contextMenu')
  const spyHover = jest.spyOn(mouse, 'hover')
  const spyPrint = jest.spyOn(print, 'print')
  const spyTouchEnd = jest.spyOn(touch, 'touchEnd')
  const spyHashChange = jest.spyOn(hash, 'hashChange')
  const spyDomActive = jest.spyOn(windowImport, 'domActive')
  const spyDomSubTreeModified = jest.spyOn(windowImport, 'domSubTreeModified')
  const spyScroll = jest.spyOn(windowImport, 'scroll')
  const spyError = jest.spyOn(resource, 'error')

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('events are turned off', () => {
    const spy = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => false)
    optionalEvents(window)
    expect(spyDragStart).toBeCalledTimes(0)
    expect(spyDragEnd).toBeCalledTimes(0)
    expect(spyCopy).toBeCalledTimes(0)
    expect(spyCut).toBeCalledTimes(0)
    expect(spyPaste).toBeCalledTimes(0)
    expect(spyBlur).toBeCalledTimes(0)
    expect(spyFocus).toBeCalledTimes(0)
    expect(spyReset).toBeCalledTimes(0)
    expect(spySubmit).toBeCalledTimes(0)
    expect(spyKeyPressed).toBeCalledTimes(0)
    expect(spyKeyDown).toBeCalledTimes(0)
    expect(spyClick).toBeCalledTimes(0)
    expect(spyDoubleClick).toBeCalledTimes(0)
    expect(spyContextMenu).toBeCalledTimes(0)
    expect(spyHover).toBeCalledTimes(0)
    expect(spyPrint).toBeCalledTimes(0)
    expect(spyTouchEnd).toBeCalledTimes(0)
    expect(spyHashChange).toBeCalledTimes(0)
    expect(spyDomActive).toBeCalledTimes(0)
    expect(spyDomSubTreeModified).toBeCalledTimes(0)
    expect(spyScroll).toBeCalledTimes(0)
    expect(spyError).toBeCalledTimes(0)
    spy.mockRestore()
  })

  it('events are turned off', () => {
    const spy = jest
      .spyOn(utils, 'shouldCollectSystemEvents')
      .mockImplementation(() => true)
    optionalEvents(window)
    expect(spyDragStart).toBeCalledTimes(1)
    expect(spyDragEnd).toBeCalledTimes(1)
    expect(spyCopy).toBeCalledTimes(1)
    expect(spyCut).toBeCalledTimes(1)
    expect(spyPaste).toBeCalledTimes(1)
    expect(spyBlur).toBeCalledTimes(1)
    expect(spyFocus).toBeCalledTimes(1)
    expect(spyReset).toBeCalledTimes(1)
    expect(spySubmit).toBeCalledTimes(1)
    expect(spyKeyPressed).toBeCalledTimes(1)
    expect(spyKeyDown).toBeCalledTimes(1)
    expect(spyClick).toBeCalledTimes(1)
    expect(spyDoubleClick).toBeCalledTimes(1)
    expect(spyContextMenu).toBeCalledTimes(1)
    expect(spyHover).toBeCalledTimes(1)
    expect(spyPrint).toBeCalledTimes(1)
    expect(spyTouchEnd).toBeCalledTimes(1)
    expect(spyHashChange).toBeCalledTimes(1)
    expect(spyDomActive).toBeCalledTimes(1)
    expect(spyDomSubTreeModified).toBeCalledTimes(1)
    expect(spyScroll).toBeCalledTimes(1)
    expect(spyError).toBeCalledTimes(1)
    spy.mockRestore()
  })
})

describe('requiredEvents', () => {
  it('ok', () => {
    const spyPagehide = jest.spyOn(windowImport, 'pagehide')
    const spyVisibilityChange = jest.spyOn(windowImport, 'visibilityChange')
    const spyOnline = jest.spyOn(network, 'online')
    const spyOffline = jest.spyOn(network, 'offline')
    requiredEvents(window)
    expect(spyPagehide).toBeCalledTimes(1)
    expect(spyVisibilityChange).toBeCalledTimes(1)
    expect(spyOnline).toBeCalledTimes(1)
    expect(spyOffline).toBeCalledTimes(1)
    spyPagehide.mockRestore()
    spyVisibilityChange.mockRestore()
    spyOnline.mockRestore()
    spyOffline.mockRestore()
  })
})
