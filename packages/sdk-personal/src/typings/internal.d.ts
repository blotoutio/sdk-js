declare module '@blotoutio/jsencrypt-no-random-padding' {
  export class JSEncrypt {
    constructor()
    setPublicKey(pk: string): void
    encrypt(key: string): string
  }
}
