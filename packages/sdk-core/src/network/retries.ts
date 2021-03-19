import { getSessionDataValue, setSessionDataValue } from '../storage'
import { info } from '../common/logUtil'
import { postRequest } from './index'
import { getIsOnline } from '../event/system/network'

let count = 0
const retries = [500, 1000, 2000, 4000, 8000, 16000, 32000]
let timeout: ReturnType<typeof setTimeout> = null

const setInterval = () => {
  clearTimeout(timeout)
  if (!retries[count]) {
    count = 0
    return
  }
  timeout = setTimeout(checkRetry, retries[count])
}

export const addItem = (payload: RequestRetry): void => {
  let data = []
  try {
    data = JSON.parse(getSessionDataValue('retries') as string) || []
  } catch (e) {
    info(e)
  }

  data.push(payload)
  setSessionDataValue('retries', JSON.stringify(data))
  setInterval()
}

export const getItem = (): RequestRetry => {
  let data
  try {
    data = getSessionDataValue('retries') as string
    if (!data) {
      return null
    }
    data = JSON.parse(data)
  } catch (e) {
    info(e)
  }

  if (!Array.isArray(data) || data.length === 0) {
    return null
  }

  const item = data.pop()
  setSessionDataValue('retries', JSON.stringify(data))
  return item
}

export const checkRetry = (): void => {
  if (!getIsOnline()) {
    return
  }

  const item = getItem()
  if (!item) {
    count = 0
    return
  }
  count++

  postRequest(item.url, item.payload)
    .then(() => {
      count = 0
    })
    .catch(info)
    .finally(() => {
      setInterval()
    })
}
