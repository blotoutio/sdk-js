import React, { useState } from 'react'
import CodeEditor from '../editor'

const Transaction = ({ onSend }) => {
  const [id, setId] = useState('123123')
  const [currency, setCurrency] = useState('EUR')
  const [payment, setPayment] = useState('credit-card')
  const [total, setTotal] = useState(20.4)
  const [discount, setDiscount] = useState(2.0)
  const [shipping, setShipping] = useState(5.0)
  const [tax, setTax] = useState(3.2)
  const [data, setData] = useState(JSON.stringify({ lang: 'de' }, null, 2))

  const send = () => {
    onSend(
      {
        ID: id,
        currency,
        payment,
        total,
        discount,
        shipping,
        tax,
      },
      data
    )
  }

  return (
    <>
      <div className='form-line'>
        <span>Transaction ID:</span>
        <input
          type='text'
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Currency:</span>
        <input
          type='text'
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Payment:</span>
        <input
          type='text'
          value={payment}
          onChange={(event) => setPayment(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Total:</span>
        <input
          type='text'
          value={total}
          onChange={(event) => setTotal(parseFloat(event.target.value))}
        />
      </div>
      <div className='form-line'>
        <span>Discount:</span>
        <input
          type='text'
          value={discount}
          onChange={(event) => setDiscount(parseFloat(event.target.value))}
        />
      </div>
      <div className='form-line'>
        <span>Shipping:</span>
        <input
          type='text'
          value={shipping}
          onChange={(event) => setShipping(parseFloat(event.target.value))}
        />
      </div>
      <div className='form-line'>
        <span>Tax:</span>
        <input
          type='text'
          value={tax}
          onChange={(event) => setTax(parseFloat(event.target.value))}
        />
      </div>
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default Transaction
