import base64 from 'crypto-js/enc-base64'
import AES from 'crypto-js/aes'
import PBKDF2 from 'crypto-js/pbkdf2'
import { error } from '../common/logUtil'
import { getLocal } from '../storage'
import { getUserIndexKey } from '../storage/key'
import { SHA256Encode } from '../common/securityUtil'
import { getUUID } from '../common/uidUtil'
import { JSEncrypt } from '@blotoutio/jsencrypt-no-random-padding'

interface Key256 {
  key256: CryptoJS.lib.WordArray
  iv: CryptoJS.lib.WordArray
}

interface RSA {
  data: string
  key: string
  iv: string
}

const getUserIndex = () => {
  const userIndex = getLocal(getUserIndexKey())
  if (!userIndex) {
    return ''
  }

  const userIndexLength = userIndex.length
  const findIndexLength = 68
  const otherIndexLength = userIndexLength - findIndexLength
  const idLengthHalf = otherIndexLength / 2
  const realIndex = userIndex.substr(idLengthHalf, findIndexLength)
  // By updating realIndex in the same string above and saving again in the same place,
  // will give us option to change the key on every write operation
  // Not implemented key change on every encrypt operation but possible if care taken and needed
  return SHA256Encode(realIndex)
}

const generate256Key = (key: string): Key256 => {
  if (key === '' || key == null || key.length < 62) {
    key = getUserIndex()
  }

  if (!key) {
    return {
      key256: base64.parse(''),
      iv: base64.parse(''),
    }
  }

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

const encryptAES = (data: string, passCode: string) => {
  const { key256, iv } = generate256Key(passCode)

  let encryptedString = ''
  try {
    if (key256 && iv) {
      encryptedString = AES.encrypt(data, key256, { iv }).toString()
    }
  } catch (e) {
    error(e)
  }

  return {
    encryptedString,
    key: key256.toString(),
    iv: iv.toString(),
  }
}

export const encryptRSA = (publicKey: string, data: string): RSA => {
  if (!publicKey) {
    return {
      data: '',
      key: '',
      iv: '',
    }
  }

  const uuidKey = getUUID() + getUUID()
  const encrypt2 = new JSEncrypt()
  encrypt2.setPublicKey(publicKey)

  const { encryptedString, iv, key } = encryptAES(data, uuidKey)

  return {
    data: encryptedString,
    key: encrypt2.encrypt(key),
    iv,
  }
}
