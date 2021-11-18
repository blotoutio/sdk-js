let logging = false

export const setLogging = (enable: boolean) => {
  logging = enable
}

export const info = (data: string): void => {
  if (logging) {
    console.info(data)
  }
}

export const log = (data: string): void => {
  if (logging) {
    console.log(data)
  }
}

// we should always print out errors
export const error = (data: string): void => {
  console.error(data)
}
