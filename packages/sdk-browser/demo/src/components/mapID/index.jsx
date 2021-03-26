import React, { useState } from 'react'

const MapID = () => {
  const [id, setId] = useState('234234234')
  const [service, setService] = useState('service')
  const [data, setData] = useState(JSON.stringify({ data: 'foo' }))

  const send = () => {
    trends('mapID', id, service, JSON.parse(data))
  }

  return (
    <>
      <div className='form-line'>
        <span>External ID:</span>
        <input
          type='text'
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Service:</span>
        <input
          type='text'
          value={service}
          onChange={(event) => setService(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Data:</span>
        <textarea
          onChange={(event) => setData(event.target.value)}
          value={data}
        />
      </div>
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default MapID
