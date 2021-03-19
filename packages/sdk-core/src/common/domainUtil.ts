let customDomain: string = null

export const setCustomDomain = (domain: string): void => {
  customDomain = domain
}

export const getDomain = (): string => {
  if (customDomain) {
    return customDomain
  }
  return window.location.hostname
}
