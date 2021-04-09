import base64 from 'crypto-js/enc-base64'
import AES from 'crypto-js/aes'
import PBKDF2 from 'crypto-js/pbkdf2'
import { JSEncrypt } from '@blotoutio/jsencrypt-no-random-padding'
import { v4 as uuidv4 } from 'uuid'

interface Key256 {
  key256: CryptoJS.lib.WordArray
  iv: CryptoJS.lib.WordArray
}

interface RSA {
  data: string
  key: string
  iv: string
}

const generate256Key = (): Key256 => {
  const key = uuidv4() + uuidv4()
  const keyStr = key.substr(5, 43)
  const salt = key.substr(20, 22)
  const iv = key.substr(40, 22)
  const saltArray = base64.parse(salt)
  const ivArray = base64.parse(iv)

  return {
    key256: PBKDF2(keyStr, saltArray, { keySize: 256 / 32, iterations: 1000 }),
    iv: ivArray,
  }
}

const encryptAES = (data: string) => {
  const { key256, iv } = generate256Key()

  return {
    encryptedString: AES.encrypt(data, key256, { iv }).toString(),
    key: key256.toString(),
    iv: iv.toString(),
  }
}

export const encryptRSA = (publicKey: string, data: string): RSA | null => {
  if (!publicKey) {
    return null
  }

  const encrypt2 = new JSEncrypt()
  encrypt2.setPublicKey(publicKey)

  const { encryptedString, iv, key } = encryptAES(data)

  return {
    data: encryptedString,
    key: encrypt2.encrypt(key),
    iv,
  }
}
