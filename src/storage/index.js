export const setLocal = (name, data) => {
  if (!name) {
    return
  }
  window.localStorage.setItem(name, data)
}

export const getLocal = (name) => {
  if (!name) {
    return null
  }
  return window.localStorage.getItem(name)
}

export const setSession = (name, data) => {
  if (!name) {
    return
  }
  window.sessionStorage.setItem(name, data)
}

export const getSession = (name) => {
  if (!name) {
    return null
  }
  return window.sessionStorage.getItem(name)
}

export const removeSession = (key) => {
  window.sessionStorage.removeItem(key)
}
