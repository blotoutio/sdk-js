import React, { useState } from 'react'
import CodeEditor from '../editor'

const PageView = () => {
  const [url, setUrl] = useState('https://jsdemo.blotout.io/new_page.html')
  const [data, setData] = useState(JSON.stringify({ lang: 'es' }, null, 2))

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
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default PageView
