let customDomain = null

export const setCustomDomain = (domain) => {
  customDomain = domain
}

export const getDomain = () => {
  if (customDomain) {
    return customDomain
  }
  return window.location.hostname
}
