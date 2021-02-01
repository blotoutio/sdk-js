import { getClientToken } from './uidUtil'

const beacon = (url, payload) => {
  const blob = new Blob([payload], { type: 'application/json' })
  navigator.sendBeacon(url, blob)
}

const ajax = async (url, payload) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      Accept: 'application/json; charset=utf-8',
    },
    body: payload || '',
  })
    .then((response) =>
      response.json().then((data) => ({ status: response.status, body: data }))
    )
    .then((data) => {
      if (data.status < 200 || data.status >= 300) {
        return Promise.reject(new Error(JSON.stringify(data.body)))
      }
      return data.body
    })
}

export async function postRequest(url, payload, options) {
  if (!url) {
    return Promise.reject(new Error('URL is empty'))
  }

  const token = getClientToken() || ''
  url = `${url}?token=${token}`

  if (options && options.method === 'beacon' && navigator.sendBeacon) {
    beacon(url, payload)
    return
  }

  return await ajax(url, payload)
}
