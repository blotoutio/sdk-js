let clientToken: string = null

export const setClientToken = (token: string): void => {
  clientToken = token
}

export const getClientToken = (): string => {
  return clientToken
}
