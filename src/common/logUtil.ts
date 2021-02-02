import { isDevMode } from './config'

export const info = (data: string): void => {
  if (isDevMode) {
    console.info(data)
  }
}

export const log = (data: string): void => {
  if (isDevMode) {
    console.log(data)
  }
}

export const error = (data: string): void => {
  if (isDevMode) {
    console.error(data)
  }
}
