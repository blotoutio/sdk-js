import { v4 as uuidv4 } from 'uuid'
import { info } from './logUtil'
import { getLocal } from '../storage'
import { getCreatedKey } from '../storage/key'

export const getMid = (eventName: string): string => {
  let time = Date.now().toString()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    const perf = performance.now()
    if (perf) {
      time = perf.toFixed(4)
    }
  }
  return `${btoa(eventName)}-${uuidv4()}-${time}`
}

export const debounce = (
  func: (...args: unknown[]) => void,
  delay: number
): ((...args: unknown[]) => void) => {
  let debounceTimer: ReturnType<typeof setTimeout>
  return function (...args: unknown[]) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func(...args), delay)
  }
}

export const getReferrer = (): null | string => {
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

export const getSearchParams = (): string => {
  const search = window.location.search
  if (!search) {
    return null
  }

  return search
}

export const getCreateTimestamp = (): number => {
  const created = parseInt(getLocal(getCreatedKey()))
  if (!isNaN(created)) {
    return created
  }

  return null
}
