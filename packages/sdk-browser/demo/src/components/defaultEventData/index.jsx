import React, { useEffect, useState } from 'react'
import CodeEditor from '../editor'

const values = [
  {
    value: 'system',
    label: 'System',
  },
  {
    value: 'codified',
    label: 'Codified',
  },
  {
    value: 'pii',
    label: 'PII',
  },
  {
    value: 'phi',
    label: 'PHI',
  },
]

const DefaultEventData = () => {
  const [types, setTypes] = useState(new Set())
  const [typesSize, setTypesSize] = useState(types.size)
  const [data, setData] = useState(JSON.stringify({ plan: 'free' }, null, 2))

  useEffect(() => {}, [typesSize])

  const save = () => {
    trends('defaultEventData', Array.from(types), JSON.parse(data))
    setTypes(new Set())
    setTypesSize(0)
  }

  return (
    <>
      <div className='form-line'>
        <span>Types:</span>
        <div>
          {values.map((item) => (
            <span key={`check-${item.value}`}>
              <input
                name='types'
                id={item.value}
                type='checkbox'
                value={item.value}
                checked={types.has(item.value)}
                onChange={(event) => {
                  event.target.checked
                    ? types.add(event.target.value)
                    : types.delete(event.target.value)
                  setTypes(types)
                  setTypesSize(types.size)
                }}
              />
              <label htmlFor={item.value}>{item.label}</label>
            </span>
          ))}
        </div>
      </div>
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='save' value='Save' onClick={save} />
      </div>
    </>
  )
}

export default DefaultEventData
