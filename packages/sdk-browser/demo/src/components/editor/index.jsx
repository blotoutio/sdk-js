import React from 'react'

const CodeEditor = (props) => {
  return (
    <div className='form-line'>
      <span>Additional Data:</span>
      <textarea
        onChange={(event) => props.setData(event.target.value)}
        value={props.data}
      />
    </div>
  )
}

export default CodeEditor
