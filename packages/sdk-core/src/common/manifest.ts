import { getManifestUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { getSessionDataValue, setSessionDataValue } from '../storage'
import { info } from './logUtil'
import type { Manifest } from '../typings'

let manifest: Manifest = null

const manifestDefaults: Manifest = {
  pushSystemEvents: 0,
}

const processData = (serverManifest: ServerVariable[]): Manifest => {
  const localManifest: Manifest = manifestDefaults
  Object.entries(manifestVariables).forEach(([key, value]) => {
    const manifestIndex = serverManifest.findIndex(
      (obj) => obj.variableId === value
    )
    if (manifestIndex === -1) {
      return
    }

    const variable = serverManifest[manifestIndex]
    if (!variable || variable.value === undefined) {
      return
    }

    let variableValue
    switch (variable.variableDataType) {
      case 1: {
        variableValue = parseInt(variable.value)
        break
      }
      case 6: {
        variableValue = variable.value
        break
      }
    }

    if (variableValue === undefined) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localManifest[key] = variableValue
  })

  return localManifest
}

const setData = (data: ServerManifest) => {
  if (!data || !data.variables) {
    return
  }

  manifest = processData(data.variables)
  setSessionDataValue('manifest', manifest)
}

export const manifestVariables: Record<keyof Manifest, number> = {
  phiPublicKey: 5997,
  piiPublicKey: 5998,
  pushSystemEvents: 5023,
}

export const getVariable = (key: keyof Manifest): string | number | boolean => {
  let variable
  if (manifest) {
    variable = manifest[key]
  }

  return variable !== undefined ? variable : manifestDefaults[key]
}

export const loadManifest = (): boolean => {
  const value = getSessionDataValue('manifest') as Manifest
  if (!value) {
    return false
  }

  manifest = value
  return true
}

export const checkManifest = (): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    pullManifest()
      .then(() => {
        resolve(true)
      })
      .catch((error) => {
        info(error)
        reject(error)
      })
  })
}

export const pullManifest = (): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    postRequest(getManifestUrl(), '')
      .then((data) => {
        setData(data as ServerManifest)
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
