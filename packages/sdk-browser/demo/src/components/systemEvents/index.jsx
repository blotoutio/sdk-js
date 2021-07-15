import React from 'react'

const SystemEvents = () => {
  return (
    <>
      <h1>Title h1</h1>
      <h2>Title h2</h2>
      <a href='https://blotout.io'>Link</a>
      <br />
      <br />
      <button className='button primary'>Button</button>
      <br />
      <br />
      <div id='div-element'>Div</div>
      <br />
      <br />
      <span className='span-element' title='span has title'>
        Span
      </span>
      <br />
      <br />
      <img src='/favicon.png' alt='favicon ' />
      <br />
      <br />
      <svg width='150' height='150' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50' cy='50' r='40' className='circle' />
      </svg>
    </>
  )
}

export default SystemEvents
