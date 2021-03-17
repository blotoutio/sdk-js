const headers = [
  navigator.platform,
  navigator.userAgent,
  navigator.appVersion,
  navigator.vendor,
  window.opera
]

const systems = [
  { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
  { name: 'Windows', value: 'Win', version: 'NT' },
  { name: 'iPhone', value: 'iPhone', version: 'OS' },
  { name: 'iPad', value: 'iPad', version: 'OS' },
  { name: 'Kindle', value: 'Silk', version: 'Silk' },
  { name: 'Android', value: 'Android', version: 'Android' },
  { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
  { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
  { name: 'Macintosh', value: 'Mac', version: 'OS X' },
  { name: 'Linux', value: 'Linux', version: 'rv' },
  { name: 'Palm', value: 'Palm', version: 'PalmOS' }
]

const matchItem = function (string) {
  for (let i = 0; i < systems.length; i += 1) {
    const regex = new RegExp(systems[i].value, 'i')
    if (regex.test(string)) {
      const regexVersion = new RegExp(systems[i].version + '[- /:;]([\\d._]+)', 'i')
      let matches = string.match(regexVersion)
      let version = ''
      if (matches) {
        if (matches[1]) {
          matches = matches[1]
        }
      }

      if (matches) {
        matches = matches.split(/[._]+/)
        for (let j = 0; j < matches.length; j += 1) {
          if (j === matches.length - 1) {
            version += matches[j]
          } else {
            version += matches[j] + '.'
          }
        }
      } else {
        version = '0'
      }
      return {
        name: systems[i].name,
        version: version
      }
    }
  }
  return { name: 'unknown', version: 0 }
}

export const getOS = () => {
  const agent = headers.join(' ')
  return matchItem(agent)
}
