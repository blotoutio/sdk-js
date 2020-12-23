import SHA256 from 'crypto-js/sha256'
import SHA1 from 'crypto-js/sha1'
import base64 from 'crypto-js/enc-base64'
import AES from 'crypto-js/aes'
import PBKDF2 from 'crypto-js/pbkdf2'
import utf8 from 'crypto-js/enc-utf8'
import { error } from './logUtil'
import { getLocal } from '../storage'
import { dataEncryptionEnabled } from '../config'
import { getUUID } from './uuidUtil'
import { getRootIndexKey } from '../storage/key'
const encrypt = require('@blotoutio/jsencrypt-no-random-padding')

const getUserIndex = () => {
  const sdkIndexData = getLocal(getRootIndexKey())
  if (!sdkIndexData) {
    return ''
  }

  const sdkIndexDataLength = sdkIndexData.length
  const findIndexLength = 68
  const otherIndexLength = sdkIndexDataLength - findIndexLength
  const idLengthHalf = otherIndexLength / 2
  const realIndex = sdkIndexData.substr(idLengthHalf, findIndexLength)
  // By updating realIndex in the same string above and saving again in the same place,
  // will give us option to change the key on every write operation
  // Not implemented key change on every encrypt operation but possible if care taken and needed
  return SHA256Encode(realIndex)
}

const generate256Key = (key) => {
  if (key === '' || key == null || key.length < 62) {
    key = getUserIndex()
  }

  if (!key) {
    return {
      key256: '',
      iv: ''
    }
  }

  const keyStr = key.substr(5, 43) // "6Le0DgMTAAAAANokdEEial"; //length=22 (16 Bytes) 32 (24 bytes) and 43 (32 Bytes)
  let salt = key.substr(20, 22) // "mHGFxENnZLbienLyANoi.e"; //length=22
  let iv = key.substr(40, 22)

  salt = base64.parse(salt)
  iv = base64.parse(iv)

  return {
    key256: PBKDF2(keyStr, salt, { keySize: 256 / 32, iterations: 1000 }),
    iv
  }
}

export const SHA256Encode = function (data) {
  if (!data) {
    return ''
  }

  return SHA256(data).toString()
}

export const SHA1Encode = function (data) {
  if (!data) {
    return ''
  }

  return SHA1(data).toString()
}

export const encryptAES = (data, passCode) => {
  let { key256, iv } = generate256Key(passCode)

  let encryptedString = ''
  try {
    if (key256 && iv) {
      encryptedString = AES.encrypt(data, key256, { iv }).toString()
    }
  } catch (e) {
    key256 = ''
    iv = ''
    error(e)
  }

  return {
    encryptedString,
    key: key256.toString(),
    iv: iv.toString()
  }
}

export const decryptAES = (encryptedStr, passCode) => {
  const { key256, iv } = generate256Key(passCode)

  if (!key256 || !iv) {
    return ''
  }

  const bytes = AES.decrypt(encryptedStr, key256, { iv })
  try {
    return bytes.toString(utf8)
  } catch (e) {
    error(e)
  }

  return ''
}

export const encryptRSA = (publicKey, data) => {
  if (!publicKey) {
    return {
      data: '',
      key: '',
      iv: ''
    }
  }

  const uuidKey = getUUID() + getUUID()
  const encrypt2 = new encrypt.JSEncrypt()
  encrypt2.setPublicKey(publicKey)

  const { encryptedString, iv, key } = encryptAES(data, uuidKey)

  return {
    data: encryptedString,
    key: encrypt2.encrypt(key),
    iv
  }
}

export const shouldEncrypt = () => {
  return dataEncryptionEnabled
}

export const stringToIntSum = (eventName) => {
  const eventNameL = eventName.toString().toLowerCase()
  const encoded = SHA1Encode(eventNameL)
  let sum = 0
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded.charAt(i)
    sum += char.charCodeAt(0)
  }
  return sum
}
