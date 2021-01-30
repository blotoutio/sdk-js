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
