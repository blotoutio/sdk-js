import React, { useState } from 'react'

const PageView = () => {
  const [url, setUrl] = useState('https://jsdemo.blotout.io/new_page.html')
  const [data, setData] = useState(JSON.stringify({ lang: 'es' }))

  const send = () => {
    trends('pageView', url, JSON.parse(data))
  }

  return (
    <>
      <div className='form-line'>
        <span>Previous page:</span>
        <input
          type='text'
          value={url}
          onChange={(event) => setUrl(event.target.value)}
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

export default PageView
