import { EventType } from '../typings'

export const getSessionKeyForEventType = (
  type: EventType
): keyof SessionData | null => {
  switch (type) {
    case 'system': {
      return 'dataSystem'
    }
    case 'codified': {
      return 'dataCodified'
    }
    case 'pii': {
      return 'dataPII'
    }
    case 'phi': {
      return 'dataPHI'
    }
  }

  return null
}
