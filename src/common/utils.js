import { getDomain } from './domainUtil'
import { getUID } from './uidUtil'

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
