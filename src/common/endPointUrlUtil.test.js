import { setUrl, getUrl, getManifestUrl } from './endPointUrlUtil'
import * as utils from '../utils'

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

  it('empty type, no manifest', () => {
    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://blotout.io/v1/events/publish')
  })

  it('empty type, manifest', () => {
    jest
      .spyOn(utils, 'getManifestVariable')
      .mockImplementationOnce(() => 'http://manifest.io')
      .mockImplementationOnce(() => 'v1/path')

    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://manifest.io/v1/path')
  })

  it('random type, no manifest', () => {
    setUrl('http://blotout.io')
    expect(getManifestUrl('random')).toBe('')
  })

  it('type event, no manifest', () => {
    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://blotout.io/v1/events/publish')
  })

  it('type event, manifest', () => {
    jest
      .spyOn(utils, 'getManifestVariable')
      .mockImplementationOnce(() => 'http://manifest.io')
      .mockImplementationOnce(() => 'v1/path')

    setUrl('http://blotout.io')
    expect(getManifestUrl()).toBe('http://manifest.io/v1/path')
  })

  it('retention event, no manifest', () => {
    setUrl('http://blotout.io')
    expect(getManifestUrl('retention')).toBe('http://blotout.io/v1/events/retention/publish')
  })

  it('retention event, manifest', () => {
    jest
      .spyOn(utils, 'getManifestVariable')
      .mockImplementationOnce(() => 'http://manifest.io')
      .mockImplementationOnce(() => 'v1/retention')

    setUrl('http://blotout.io')
    expect(getManifestUrl('retention')).toBe('http://manifest.io/v1/retention')
  })
})
