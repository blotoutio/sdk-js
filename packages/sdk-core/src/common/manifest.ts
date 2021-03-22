import { getManifestUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { getDomain } from './domainUtil'
import { getSessionDataValue, setSessionDataValue } from '../storage'
import { info } from './logUtil'
import type { Manifest } from '../typings'

let manifest: Manifest = null

const manifestDefaults: Manifest = {
  deviceInfoGrain: 1,
  eventPath: 'v1/events/publish',
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
      case 2:
      case 3:
      case 4: {
        variableValue = parseFloat(variable.value)
        break
      }
      case 5: {
        variableValue = !!variable.value
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
  deviceInfoGrain: 5004,
  eventPath: 5016,
  phiPublicKey: 5997,
  piiPublicKey: 5998,
  pushSystemEvents: 5023,
  endPoint: 5009,
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
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain(),
    })
    postRequest(getManifestUrl(), payload)
      .then((data) => {
        setData(data as ServerManifest)
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}