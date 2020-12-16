import { getLocal, getSession, setLocal, setSession } from '.'

describe('LocalData', () => {
  it('set', () => {
    const localDataStr = setLocal('names', JSON.stringify({ fname: 'ashish', lname: 'nigam' }))
    expect(localDataStr).toBe(undefined)
  })

  it('get', () => {
    const localDataStr = getLocal('names')
    const localData = JSON.parse(localDataStr)
    const firstName = localData.fname
    expect(firstName).toBe('ashish')
  })
})

describe('SessionData', () => {
  it('setSession value in window session storage & and match', () => {
    const sessionDataStr = setSession('sessionKey', JSON.stringify({
      name1: 'session',
      name2: 'storage'
    }))
    expect(sessionDataStr).toBe(undefined)
  })

  it('getSession value from window session storage & and match', () => {
    const sessionDataStr = getSession('sessionKey')
    const sessionData = JSON.parse(sessionDataStr)
    const storageName = sessionData.name1
    expect(storageName).toBe('session')
  })
})
