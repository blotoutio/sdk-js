import { setUrl, getUrl, getPublishUrl } from './endPoint'
import * as manifest from '../common/manifest'

describe('get/setUrl', () => {
  it('null', () => {
    setUrl('')
    expect(getUrl()).toBe('')
  })

  it('null', () => {
    setUrl()
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

  it('no manifest', () => {
    setUrl('http://blotout.io')
    expect(getPublishUrl()).toBe('http://blotout.io/v1/events/publish?token=')
  })

  it('ok', () => {
    jest
      .spyOn(manifest, 'getVariable')
      .mockImplementationOnce(() => 'v1/path')
      .mockImplementationOnce(() => 'http://manifest.io')

    setUrl('http://blotout.io')
    expect(getPublishUrl()).toBe('http://manifest.io/v1/path?token=')
  })
})
