import { getLocalData, getSessionData, setLocalData, setSessionData } from '.'

describe('LocalData', () => {
  it('set', () => {
    const localDataStr = setLocalData('names', JSON.stringify({ fname: 'ashish', lname: 'nigam' }))
    expect(localDataStr).toBe(undefined)
  })

  it('get', () => {
    const localDataStr = getLocalData('names')
    const localData = JSON.parse(localDataStr)
    const firstName = localData.fname
    expect(firstName).toBe('ashish')
  })
})

describe('SessionData', () => {
  it('setSessionData value in window session storage & and match', () => {
    const sessionDataStr = setSessionData('sessionKey', JSON.stringify({
      name1: 'session',
      name2: 'storage'
    }))
    expect(sessionDataStr).toBe(undefined)
  })

  it('getSessionData value from window session storage & and match', () => {
    const sessionDataStr = getSessionData('sessionKey')
    const sessionData = JSON.parse(sessionDataStr)
    const storageName = sessionData.name1
    expect(storageName).toBe('session')
  })
})
