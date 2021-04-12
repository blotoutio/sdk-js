import React, { useState } from 'react'

const Personal = () => {
  const [name, setName] = useState('personal-event')
  const [method, setMethod] = useState('normal')
  const [type, setType] = useState('pii')
  const [data, setData] = useState(JSON.stringify({ lang: 'sl' }))

  const send = () => {
    let options = null
    if (method === 'beacon') {
      options = {
        method: 'beacon',
      }
    }

    const isPHI = type === 'phi'

    trends('capturePersonal', name, JSON.parse(data), isPHI, options)
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
      <div className='form-line'>
        <span>Data:</span>
        <textarea
          onChange={(event) => setData(event.target.value)}
          value={data}
        />
      </div>
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
        <span>Type:</span>
        <input
          type='radio'
          id='pii'
          name='type'
          checked={type === 'pii'}
          onChange={(event) => {
            if (event.target.checked) setType('pii')
          }}
        />
        <label htmlFor='pii'>PII</label>
        <input
          id='phi'
          type='radio'
          name='type'
          checked={type === 'phi'}
          onChange={(event) => {
            if (event.target.checked) setType('phi')
          }}
        />
        <label htmlFor='phi'>PHI</label>
      </div>
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default Personal
