import { setUrl, getUrl, getPublishUrl } from './endPoint'

describe('get/setUrl', () => {
  it('null', () => {
    setUrl('')
    expect(getUrl()).toBe('')
  })
  it('data', () => {
    setUrl('http://blotout.io')
    expect(getUrl()).toBe('http://blotout.io')
  })
})

describe('getPublishUrl', () => {
  beforeEach(() => {
    setUrl('')
  })

  it('endpoint not set', () => {
    expect(getPublishUrl()).toBe('')
  })

  it('ok', () => {
    setUrl('http://blotout.io')
    expect(getPublishUrl()).toBe('http://blotout.io/v1/events/publish?token=')
  })
})
