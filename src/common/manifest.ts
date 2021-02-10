import { getManifestUrl } from '../network/endPoint'
import { postRequest } from '../network'
import { getDomain } from './domainUtil'
import { getSessionDataValue, setSessionDataValue } from '../storage'
import { info } from './logUtil'

let manifest: LocalManifest = null

const processData = (manifest: ServerVariable[]): LocalManifest => {
  const variables: LocalManifest = {}
  Object.entries(manifestVariables).forEach(([key, value]) => {
    const manifestIndex = manifest.findIndex((obj) => obj.variableId === value)
    if (manifestIndex === -1) {
      return
    }

    const variable = manifest[manifestIndex]
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

    variables[key] = variableValue
  })

  return variables
}

const setData = (data: ServerManifest) => {
  if (!data || !data.variables) {
    return
  }

  manifest = processData(data.variables)
  setSessionDataValue('manifest', manifest)
}

export const manifestVariables = {
  deviceInfoGrain: 5004,
  eventPath: 5016,
  phiPublicKey: 5997,
  piiPublicKey: 5998,
  pushSystemEvents: 5023,
}

export const manifestDefaults: Record<string, string | number | boolean> = {
  deviceInfoGrain: 1,
  eventPath: 'v1/events/publish',
  pushSystemEvents: 0,
}

export const getVariable = (key: string): string | number | boolean => {
  let variable
  if (manifest) {
    variable = manifest[key]
  }

  return variable !== undefined ? variable : manifestDefaults[key]
}

export const checkManifest = (newSession: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!newSession) {
      const value = getSessionDataValue('manifest') as LocalManifest
      if (value) {
        manifest = value
        resolve()
        return
      }
    }

    pullManifest()
      .then(resolve)
      .catch((error) => {
        info(error)
        reject(error)
      })
  })
}

export const pullManifest = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain(),
    })
    postRequest(getManifestUrl(), payload)
      .then((data) => {
        setData(data as ServerManifest)
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}
