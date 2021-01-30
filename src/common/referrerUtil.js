import { info } from './logUtil'

let referer = 'none'

export const setReferrer = () => {
  try {
    if (document.referrer) {
      const refererUrl = new URL(document.referrer)
      if (refererUrl !== window.location.host) {
        referer = refererUrl.href
      }
    }
  } catch (error) {
    info(error)
  }
}

export const getReferrer = () => {
  return referer
}
