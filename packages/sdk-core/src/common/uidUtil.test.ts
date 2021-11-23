import { getUIDFromCookie, getUIDFromLocal } from './uidUtil'
import { setLocal } from '../storage'
import { getUIDKey } from '../storage/key'

describe('getUIDFromLocal', () => {
  it('from cookie', () => {
    const result = getUIDFromLocal()
    expect(result).toEqual('')
  })

  it('exists', () => {
    setLocal(
      getUIDKey(),
      'd2e74649-18b7-4504-80af-e844232a98cc-1614847234503-131067e3-a2ad-471b-859c-ca9bf796bb01'
    )
    const result = getUIDFromLocal()
    expect(result.length).toEqual(87)
  })
})

describe('getUIDFromCookie', () => {
  it('cookie is empty', () => {
    document.cookie = ''
    const result = getUIDFromCookie()
    expect(result).toEqual('')
  })

  it('corrupt cookie', () => {
    document.cookie = '; ; '
    const result = getUIDFromCookie()
    expect(result).toEqual('')
  })

  it('our cookie is not set', () => {
    document.cookie = 'username=John Doe'
    const result = getUIDFromCookie()
    expect(result).toEqual('')
  })

  it('single cookie', () => {
    document.cookie = '_trends_user_id=k4j12i4j12i4p123j4ij23'
    const result = getUIDFromCookie()
    expect(result).toEqual('k4j12i4j12i4p123j4ij23')
  })

  it('multiple cookies', () => {
    document.cookie =
      '_trends_user_id=k4j12i4j12i4p123j4ij23; username=John Doe'
    const result = getUIDFromCookie()
    expect(result).toEqual('k4j12i4j12i4p123j4ij23')
  })
})
