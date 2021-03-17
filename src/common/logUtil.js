import { isDevMode } from '../config'

export const info = (data) => {
  if (isDevMode) {
    console.info(data)
  }
}

export const log = (data) => {
  if (isDevMode) {
    console.log(data)
  }
}

export const error = (data) => {
  if (isDevMode) {
    console.error(data)
  }
}
