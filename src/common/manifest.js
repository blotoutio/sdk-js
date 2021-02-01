import { getUrl } from './endPointUrlUtil'
import { constants } from './config'
import { postRequest } from './networkUtil'
import { getDomain } from './domainUtil'
import { getSessionDataValue, setSessionDataValue } from '../storage'

const processData = (manifest) => {
  const variables = {}
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

let manifest = null

const setData = (data) => {
  if (!data || !data.variables) {
    return
  }

  manifest = processData(data.variables)
  setSessionDataValue('manifest', manifest)
}

export const manifestVariables = {
  apiEndpoint: 5009,
  deviceInfoGrain: 5004,
  eventPath: 5016,
  phiPublicKey: 5997,
  piiPublicKey: 5998,
  pushSystemEvents: 5023,
}

export const manifestDefaults = {
  deviceInfoGrain: 1,
  eventPath: 'v1/events/publish',
  pushSystemEvents: 0,
}

export const getVariable = (key) => {
  let variable = null
  if (manifest) {
    variable = manifest[key]
  }

  if (!variable) {
    return manifestDefaults[key]
  }

  return variable.value
}

export const checkManifest = (newSession) => {
  return new Promise((resolve, reject) => {
    if (!newSession) {
      const value = getSessionDataValue('manifest')
      if (value) {
        manifest = value
        resolve()
        return
      }
    }

    pullManifest()
      .then(resolve)
      .catch((error) => {
        reject(error)
      })
  })
}

export const pullManifest = () => {
  return new Promise((resolve, reject) => {
    const url = `${getUrl()}/${constants.MANIFEST_PATH}`
    const payload = JSON.stringify({
      lastUpdatedTime: 0,
      bundleId: getDomain(),
    })
    postRequest(url, payload)
      .then((data) => {
        setData(data)
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}
