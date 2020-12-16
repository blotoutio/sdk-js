describe('getOS', () => {
  it('empty', () => {
    navigator.__defineGetter__('platform', () => '')
    navigator.__defineGetter__('userAgent', () => '')
    navigator.__defineGetter__('appVersion', () => '')
    navigator.__defineGetter__('vendor', () => '')

    const { getOS } = require('./operatingSystemUtil')
    const result = getOS()
    expect(result).toStrictEqual({
      name: 'unknown',
      version: '0'
    })
  })

  it('no version match', () => {
    navigator.__defineGetter__('platform', () => '')
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Macintosh; Intel Mac 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36')
    navigator.__defineGetter__('appVersion', () => '')
    navigator.__defineGetter__('vendor', () => '')

    const { getOS } = require('./operatingSystemUtil')
    const result = getOS()
    expect(result).toStrictEqual({
      name: 'Macintosh',
      version: '0'
    })
  })

  it('ok', () => {
    navigator.__defineGetter__('platform', () => 'MacIntel')
    navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36')
    navigator.__defineGetter__('appVersion', () => '5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36')
    navigator.__defineGetter__('vendor', () => 'Google Inc.')

    const { getOS } = require('./operatingSystemUtil')
    const result = getOS()
    expect(result).toStrictEqual({
      name: 'Macintosh',
      version: '11.0.1'
    })
  })
})
