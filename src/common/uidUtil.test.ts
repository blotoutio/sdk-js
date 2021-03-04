import { generateUUID, getUID, getUUID, setUID } from './uidUtil'
import { getLocal, setLocal } from '../storage'
import { getUIDKey } from '../storage/key'
import { setClientToken } from './clientToken'

const testUUID = (number: number) => {
  return new Promise((resolve) => {
    const array = []
    for (let i = 0; i < number; i++) {
      array.push(generateUUID())
    }

    resolve(array)
  })
}

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
    expect(getLocal(getUIDKey()).length).toEqual(87)
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
      'd2e74649-18b7-4504-80af-e844232a98cc-1614847234503-131067e3-a2ad-471b-859c-ca9bf796bb01'
    )
    setUID()
    const result = getUID()
    expect(result.length).toEqual(87)
  })
})

describe('generateUUID', () => {
  it('collision test', () => {
    const iterations = 100
    const nodes = 10000

    const promises = []
    for (let i = 0; i < nodes; i++) {
      promises.push(testUUID(iterations))
    }

    Promise.all(promises).then((values) => {
      const result = values.flat()
      expect(new Set(result).size === result.length).toBeTruthy()
    })
  })

  it('performance is not available', () => {
    Object.defineProperty(performance, 'now', {
      value: undefined,
    })
    expect(generateUUID().length).toBe(87)
  })
})
