import React from 'react'

const Enable = () => {
  const handleClick = (enable) => {
    trends('enable', enable)
  }

  return (
    <>
      <div className='form-line'>
        <button
          id='enable-true'
          className='primary'
          onClick={handleClick.bind(this, true)}
        >
          Enable SDK
        </button>
      </div>
      <div className='form-line'>
        <button
          id='enable-false'
          className='secondary'
          onClick={handleClick.bind(this, false)}
        >
          Disable SDK
        </button>
      </div>
    </>
  )
}

export default Enable
