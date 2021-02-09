import { addItem } from './retries'

const beacon = (url: string, payload: string) => {
  const blob = new Blob([payload], { type: 'application/json' })
  navigator.sendBeacon(url, blob)
}

const ajax = async (url: string, payload: string) => {
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
        addItem({
          payload,
          url,
        })
        return Promise.reject(new Error(JSON.stringify(data.body)))
      }
      return data.body
    })
    .catch((error) => {
      addItem({
        payload,
        url,
      })
      return Promise.reject(new Error(error))
    })
}

export async function postRequest(
  url: string,
  payload: string,
  options?: EventOptions
): Promise<unknown> {
  if (!url) {
    return Promise.reject(new Error('URL is empty'))
  }

  if (options && options.method === 'beacon' && navigator.sendBeacon) {
    beacon(url, payload)
    return
  }

  return await ajax(url, payload)
}
