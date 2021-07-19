import React, { useState } from 'react'
import CodeEditor from '../editor'

const Persona = ({ onSend }) => {
  const [id, setId] = useState('312312')
  const [firstname, setFirstname] = useState('John')
  const [lastname, setLastname] = useState('Smith')
  const [middlename, setMiddlename] = useState('Jack')
  const [username, setUsername] = useState('jsmith')
  const [dob, setDob] = useState('4/30/2000')
  const [email, setEmail] = useState('j@domain.com')
  const [number, setNumber] = useState('+386 31 777 444')
  const [address, setAddress] = useState('Street 1')
  const [city, setCity] = useState('Some City')
  const [state, setState] = useState('CA')
  const [zip, setZip] = useState(10000)
  const [country, setCountry] = useState('US')
  const [gender, setGender] = useState('female')
  const [age, setAge] = useState(22)
  const [data, setData] = useState(JSON.stringify({ lang: 'de' }, null, 2))

  const send = () => {
    onSend(
      {
        ID: id,
        firstname,
        lastname,
        middlename,
        username,
        dob,
        email,
        number,
        address,
        city,
        state,
        zip,
        country,
        gender,
        age,
      },
      data
    )
  }

  return (
    <>
      <div className='form-line'>
        <span>Persona ID:</span>
        <input
          type='text'
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>First Name:</span>
        <input
          type='text'
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Last Name:</span>
        <input
          type='text'
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Middle Name:</span>
        <input
          type='text'
          value={middlename}
          onChange={(event) => setMiddlename(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Username:</span>
        <input
          type='text'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Date of Birth:</span>
        <input
          type='text'
          value={dob}
          onChange={(event) => setDob(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Email:</span>
        <input
          type='text'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Phone Number:</span>
        <input
          type='text'
          value={number}
          onChange={(event) => setNumber(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Address:</span>
        <input
          type='text'
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>City:</span>
        <input
          type='text'
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>State:</span>
        <input
          type='text'
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>ZIP:</span>
        <input
          type='text'
          value={zip}
          onChange={(event) => setZip(parseInt(event.target.value))}
        />
      </div>
      <div className='form-line'>
        <span>Country:</span>
        <input
          type='text'
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Gender:</span>
        <input
          type='text'
          value={gender}
          onChange={(event) => setGender(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Age:</span>
        <input
          type='text'
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />
      </div>
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default Persona
