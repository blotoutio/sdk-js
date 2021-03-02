import { getDomain } from './domainUtil'
import { getUID } from './uidUtil'
import { info } from './logUtil'
import { setLocal } from '../storage'
import { getCreatedKey } from '../storage/key'

export const getMid = (): string => {
  return `${getDomain()}-${getUID()}-${Date.now()}`
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

export const getSearchParams = (): Record<string, string> => {
  const search = window.location.search
  if (!search) {
    return null
  }

  const result: Record<string, string> = {}
  const params = new URLSearchParams(window.location.search)
  params.forEach((value: string, key: string) => {
    result[key] = value
  })

  return result
}

export const setCreateTimestamp = (): void => {
  setLocal(getCreatedKey(), Date.now().toString())
}
