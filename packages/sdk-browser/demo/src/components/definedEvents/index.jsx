import React, { useState } from 'react'
import MapID from './mapID'
import Transaction from './transaction'
import Item from './item'
import Persona from './persona'

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
      case 'item': {
        return <Item onSend={handleSend} />
      }
      case 'persona': {
        return <Persona onSend={handleSend} />
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
          <option value='item'>item</option>
          <option value='persona'>persona</option>
        </select>
      </div>
      {getEvent()}
    </>
  )
}

export default DefinedEvents
