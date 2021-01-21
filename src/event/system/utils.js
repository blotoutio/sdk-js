import { constants, systemEventCode } from '../../config'
import { getMid, getObjectTitle } from '../../utils'

export const createScrollEventInfo = (eventName, objectName, meta = {}, event = {}, mousePos = {}) => {
  const position = {
    x: mousePos.mousePosX != null ? mousePos.mousePosX : -1,
    y: mousePos.mousePosY != null ? mousePos.mousePosY : -1,
    width: -1,
    height: -1
  }

  return {
    sentToServer: false,
    objectName: objectName,
    name: eventName,
    urlPath: window.location.href,
    tstmp: Date.now(),
    mid: getMid(),
    nmo: 1,
    evc: constants.EVENT_CATEGORY,
    evcs: systemEventCode[eventName],
    position,
    metaInfo: meta,
    objectTitle: getObjectTitle(event, eventName)
  }
}
