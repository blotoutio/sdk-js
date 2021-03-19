declare module '@blotoutio/jsencrypt-no-random-padding' {
  export class JSEncrypt {
    constructor()
    setPublicKey(pk: string): void
    encrypt(key: string): string
  }
}

interface PersonalData {
  data: string
  iv: string
  key: string
}

interface SendEventExtra {
  pii?: PersonalData
  phi?: PersonalData
}
