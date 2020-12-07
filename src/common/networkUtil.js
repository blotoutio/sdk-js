import { getValueFromSPTempUseStore } from './storageUtil'
import { constants } from '../config'

export async function getRequest (url) {
  const token = getValueFromSPTempUseStore(constants.SDK_TOKEN)
  return await fetch(
    url,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json; charset=utf-8',
        version: 'v1',
        token
      }
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status < 200 || data.status >= 300) {
        return Promise.reject(new Error(JSON.stringify(data.body)))
      }
      return data.body
    })
}

export async function postRequest (url, payload) {
  const token = getValueFromSPTempUseStore(constants.SDK_TOKEN)
  return await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Accept: 'application/json; charset=utf-8',
        version: 'v1',
        token
      },
      body: payload
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status < 200 || data.status >= 300) {
        return Promise.reject(new Error(JSON.stringify(data.body)))
      }
      return data.body
    })
}