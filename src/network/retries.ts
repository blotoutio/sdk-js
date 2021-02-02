import { getLocal, removeLocal, setLocal } from '../storage'
import { getRetryKey } from '../storage/key'
import { info } from '../common/logUtil'
import { postRequest } from '.'
import { constants } from '../common/config'

let count = 1
let timeout: ReturnType<typeof setTimeout> = null

const setInterval = () => {
  clearTimeout(timeout)
  timeout = setTimeout(checkRetry, count * constants.RETRY_INTERVAL)
}

export const addItem = (payload: RequestRetry): void => {
  let data = []
  try {
    data = JSON.parse(getLocal(getRetryKey())) || []
  } catch (e) {
    info(e)
  }

  data.push(payload)
  setLocal(getRetryKey(), JSON.stringify(data))
  setInterval()
}

export const getItem = (): RequestRetry => {
  let data
  try {
    data = JSON.parse(getLocal(getRetryKey()))
  } catch (e) {
    info(e)
  }

  if (!Array.isArray(data) || data.length === 0) {
    removeLocal(getRetryKey())
    return null
  }

  const item = data.pop()
  setLocal(getRetryKey(), JSON.stringify(data))
  return item
}

export const checkRetry = (): void => {
  const item = getItem()
  if (!item) {
    count = 1
    return
  }
  count++

  postRequest(item.url, item.payload).catch(info)
  setInterval()
}
