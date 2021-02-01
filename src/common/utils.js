import { getDomain } from './domainUtil'
import { getUID } from './uidUtil'
import { info } from './logUtil'

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

export const getReferrer = () => {
  let referer = null
  try {
    if (document.referrer) {
      const refererUrl = new URL(document.referrer)
      if (refererUrl.host !== window.location.host) {
        referer = refererUrl.href
      }
    }
  } catch (error) {
    info(error)
  }

  return referer
}

export const getSearchParams = () => {
  const search = window.location.search
  if (!search) {
    return null
  }

  const result = {}
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of params) {
    result[key] = value
  }

  return result
}
