import React, { useState } from 'react'
import CodeEditor from '../editor'

const Event = () => {
  const [name, setName] = useState('codified-event')
  const [method, setMethod] = useState('normal')
  const [data, setData] = useState(JSON.stringify({ lang: 'en' }, null, 2))

  const send = () => {
    let options = null
    if (method === 'beacon') {
      options = {
        method: 'beacon',
      }
    }

    trends('capture', name, JSON.parse(data), options)
  }

  return (
    <>
      <div className='form-line'>
        <span>Name:</span>
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <span>Method:</span>
        <input
          id='normal'
          type='radio'
          name='method'
          checked={method === 'normal'}
          onChange={(event) => {
            if (event.target.checked) setMethod('normal')
          }}
        />
        <label htmlFor='normal'>Normal</label>
        <input
          id='beacon'
          type='radio'
          name='method'
          checked={method === 'beacon'}
          onChange={(event) => {
            if (event.target.checked) setMethod('beacon')
          }}
        />
        <label htmlFor='beacon'>Beacon</label>
      </div>
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default Event
