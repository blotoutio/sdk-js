declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCalledWithSendEvent(...args: Array<unknown>): R
    }
  }
}

export {}
