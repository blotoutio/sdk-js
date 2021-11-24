import React from 'react'

const Settings = () => {
  const handleEnable = (enable) => {
    trends('enable', enable)
  }

  const handleLogging = (enable) => {
    trends('logging', enable)
  }

  return (
    <>
      <div className='form-line'>
        <button
          id='enable-true'
          className='primary'
          onClick={handleEnable.bind(this, true)}
        >
          Enable SDK
        </button>
      </div>
      <div className='form-line'>
        <button
          id='enable-false'
          className='secondary'
          onClick={handleEnable.bind(this, false)}
        >
          Disable SDK
        </button>
      </div>
      <div className='form-line'>
        <button
          id='logging-true'
          className='primary'
          onClick={handleLogging.bind(this, true)}
        >
          Enable Logging
        </button>
      </div>
      <div className='form-line'>
        <button
          id='logging-false'
          className='secondary'
          onClick={handleLogging.bind(this, false)}
        >
          Disable Logging
        </button>
      </div>
    </>
  )
}

export default Settings
