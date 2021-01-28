import { setUrl, getUrl, getManifestUrl } from './endPointUrlUtil'
import * as manifest from '../manifest'

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

describe('getManifestUrl', () => {
  beforeEach(() => {
    setUrl('')
  })

  it('endpoint not set', () => {
    expect(getManifestUrl()).toBe('')
  })

  it('no manifest', () => {
    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://blotout.io/v1/events/publish')
  })

  it('ok', () => {
    jest
      .spyOn(manifest, 'getVariable')
      .mockImplementationOnce(() => 'http://manifest.io')
      .mockImplementationOnce(() => 'v1/path')

    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://manifest.io/v1/path')
  })
})
