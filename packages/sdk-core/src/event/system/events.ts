import { sendSystemEvent } from '../index'
import { debounce } from '../../common/utils'
import { constants } from '../../common/config'

export const systemEvents: SystemEvents = {
  '11101': {
    name: 'cut',
  },
  '11102': {
    name: 'copy',
  },
  '11103': {
    name: 'paste',
  },
  '11104': {
    name: 'dragstart',
  },
  '11105': {
    name: 'dragend',
  },
  '11106': {
    name: 'error',
  },
  '11107': {
    name: 'keydown',
    operation: () => {
      window.addEventListener('keydown', (event) => {
        if (event.key === 'F1') {
          sendSystemEvent('help', event)
        }
      })
    },
  },
  '11108': {
    name: 'blur',
  },
  '11109': {
    name: 'focus',
  },
  '11110': {
    name: 'reset',
  },
  '11111': {
    name: 'submit',
  },
  '11112': {
    name: 'keypress',
  },
  '11113': {
    name: 'dblclick',
  },
  '11114': {
    name: 'contextmenu',
  },
  '11115': {
    name: 'offline',
  },
  '11116': {
    name: 'online',
  },
  '11117': {
    name: 'afterprint',
  },
  '11118': {
    name: 'touchend',
  },
  '11119': {
    name: 'click',
    operation: () => {
      window.addEventListener('click', (event) => {
        sendSystemEvent('click', event, { method: 'beacon' })
      })
    },
  },
  '11120': {
    name: 'hashchange',
  },
  '11121': {
    name: 'resize',
  },
  '11122': {
    name: 'scroll',
    operation: () => {
      window.addEventListener(
        'scroll',
        debounce((event: Event) => {
          sendSystemEvent('scroll', event)
        }, constants.SCROLL_INTERVAL)
      )
    },
  },
  '11123': {
    name: 'hover',
    operation: () => {
      let timeout: ReturnType<typeof setTimeout>
      window.addEventListener('mouseover', (event) => {
        timeout = setTimeout(() => {
          sendSystemEvent('hover', event)
        }, 2000)
      })

      window.addEventListener('mouseout', () => {
        clearTimeout(timeout)
      })
    },
  },
}
