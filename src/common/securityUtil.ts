import SHA1 from 'crypto-js/sha1'

const SHA1Encode = function (data: string) {
  if (!data) {
    return ''
  }

  return SHA1(data).toString()
}

export const stringToIntSum = (eventName: string): number => {
  const eventNameL = eventName.toString().toLowerCase()
  const encoded = SHA1Encode(eventNameL)
  let sum = 0
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded.charAt(i)
    sum += char.charCodeAt(0)
  }
  return sum
}
