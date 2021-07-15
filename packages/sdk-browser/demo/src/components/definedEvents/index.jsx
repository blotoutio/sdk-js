import React, { useState } from 'react'
import MapID from './mapID'
import Transaction from './transaction'

const DefinedEvents = () => {
  const [event, setEvent] = useState('mapID')

  const handleSend = (eventData, additionalData) => {
    trends(event, eventData, JSON.parse(additionalData))
  }

  const getEvent = () => {
    switch (event) {
      case 'mapID': {
        return <MapID onSend={handleSend} />
      }
      case 'transaction': {
        return <Transaction onSend={handleSend} />
      }
    }
  }

  const handleSelect = (e) => {
    setEvent(e.target.value)
  }

  return (
    <>
      <div className='form-line'>
        <span>Defined event:</span>
        <select id='event-selection' onChange={handleSelect}>
          <option value='mapID'>mapID</option>
          <option value='transaction'>transaction</option>
        </select>
      </div>
      {getEvent()}
    </>
  )
}

export default DefinedEvents