import { getDomain } from './domainUtil'
import { getUID } from './uuidUtil'

export const getMid = () => {
  return `${getDomain()}-${getUID()}-${Date.now()}`
}

export const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

export const getObjectTitle = (event, eventName) => {
  if (
    eventName !== 'click' &&
    eventName !== 'mouseover' &&
    eventName !== 'hoverc' &&
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

export const getSelector = (ele) => {
  if (!ele) {
    return 'Unknown'
  }

  if (ele.localName) {
    return (
      ele.localName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
  }

  if (ele.nodeName) {
    return (
      ele.nodeName +
      (ele.id ? '#' + ele.id : '') +
      (ele.className ? '.' + ele.className : '')
    )
  }

  if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return 'Window'
  }

  return 'Unknown'
}

export const DNT = () => {
  if (window.doNotTrack || navigator.doNotTrack) {
    if (
      window.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes' ||
      navigator.doNotTrack === '1'
    ) {
      return true
    }
  }

  return false
}
