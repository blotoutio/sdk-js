import React, { useState } from 'react'
import Event from '../event'
import Personal from '../personal'
import PageView from '../pageView'
import UserID from '../userID'
import DefinedEvents from '../definedEvents'
import Settings from '../settings'
import DefaultEventData from '../defaultEventData'
import SystemEvents from '../systemEvents'

const tabs = [
  {
    id: 'event',
    name: 'Event',
    component: <Event />,
  },
  {
    id: 'personal',
    name: 'Personal Event',
    component: <Personal />,
  },
  {
    id: 'page-view',
    name: 'Page View',
    component: <PageView />,
  },
  {
    id: 'defined-events',
    name: 'Defined Events',
    component: <DefinedEvents />,
  },
  {
    id: 'user-id',
    name: 'User ID',
    component: <UserID />,
  },
  {
    id: 'settings',
    name: 'Settings',
    component: <Settings />,
  },
  {
    id: 'default-event-data',
    name: 'Default event data',
    component: <DefaultEventData />,
  },
  {
    id: 'system-event',
    name: 'System events',
    component: <SystemEvents />,
  },
]

const App = () => {
  const [tab, setTab] = useState(0)

  const clearSession = () => {
    window.sessionStorage.clear()
  }

  const clearUser = () => {
    window.localStorage.clear()
  }

  return (
    <div className='events wrapper'>
      <div className='events-actions'>
        {tabs.map((item, index) => {
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => setTab(index)}
              className={tab === index ? 'active' : ''}
            >
              {item.name}
            </button>
          )
        })}
        <button onClick={clearSession}>Clear session</button>
        <button onClick={clearUser}>Clear user</button>
      </div>
      <div className='events-content'>{tabs[tab].component}</div>
    </div>
  )
}

export default App
