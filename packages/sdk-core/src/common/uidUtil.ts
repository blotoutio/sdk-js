import { getLocal } from '../storage'
import { getUIDKey } from '../storage/key'

export const getUIDFromCookie = (): string => {
  const cookie = document.cookie
  if (!cookie) {
    return ''
  }

  const cookies = cookie.split('; ')

  for (const item of cookies) {
    if (!item) {
      continue
    }

    const [key, value] = item.split('=', 2)
    if (key === '_trends_user_id') {
      return value
    }
  }

  return ''
}

export const getUIDFromLocal = (): string => {
  const userUUID = getLocal(getUIDKey())
  if (!userUUID) {
    return ''
  }

  return userUUID
}
