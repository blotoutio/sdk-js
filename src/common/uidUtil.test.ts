import { convertTo64CharUUID, getUID, getUUID, setUID } from './uidUtil'
import { getLocal, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'
import { setClientToken } from './clientToken'

describe('convertTo64CharUUID', () => {
  it('empty', () => {
    const result = convertTo64CharUUID('')
    expect(result).toEqual('')
  })

  it('data', () => {
    const result = convertTo64CharUUID(
      '73a682db-a292-4e56ee53ddd38a0d9c20-36f386ba-7a6f0029-191f0c86-0d6622296d1470f0d25a246f-b2ac-dc1566a7f49b'
    )
    expect(result).toEqual(
      '73a682db-a292-4e-56ee53dd-d38a0d9c-20-36f38-6ba-7a6f0029-191f0c86-0d'
    )
  })
})

describe('getUUID', () => {
  it('ok', () => {
    const result = getUUID()
    expect(result.length).toEqual(36)
  })
})

describe('setUID', () => {
  it('new user, no client token', () => {
    setUID()
    expect(getLocal(getUIDKey())).toBeNull()
  })

  it('new user, client token', () => {
    setClientToken('token set')
    setUID()
    expect(getLocal(getUIDKey()).length).toEqual(68)
  })

  it('from storage', () => {
    setLocal(getUIDKey(), 'key')
    setUID()
  })
})

describe('getUID', () => {
  it('ok', () => {
    setLocal(
      getUIDKey(),
      '64e9b82014c0a5b9-3e2b2214-72f2c155-df1b28e1-0b62529fbad4ad02cf7e5c84'
    )
    setUID()
    const result = getUID()
    expect(result.length).toEqual(68)
  })
})
