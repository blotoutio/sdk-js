import React, { useState } from 'react'
import CodeEditor from '../editor'

const MapID = () => {
  const [id, setId] = useState('234234234')
  const [service, setService] = useState('sass')
  const [data, setData] = useState(JSON.stringify({ lang: 'de' }, null, 2))

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
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default MapID
