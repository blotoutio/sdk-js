import React, { useState } from 'react'
import CodeEditor from '../editor'

const Item = ({ onSend }) => {
  const [id, setId] = useState('123123')
  const [name, setName] = useState('EV')
  const [sku, setSku] = useState('SHOP-01')
  const [category, setCategory] = useState(['cars', 'electric'])
  const [price, setPrice] = useState(20.4)
  const [currency, setCurrency] = useState('EUR')
  const [quantity, setQuantity] = useState(2)
  const [data, setData] = useState(JSON.stringify({ lang: 'de' }, null, 2))

  const send = () => {
    onSend(
      {
        ID: id,
        name,
        sku,
        category,
        price,
        currency,
        quantity,
      },
      data
    )
  }

  return (
    <>
      <div className='form-line'>
        <span>Item ID:</span>
        <input
          type='text'
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Name:</span>
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>SKU:</span>
        <input
          type='text'
          value={sku}
          onChange={(event) => setSku(event.target.value)}
        />
      </div>
      <div className='form-line'>
        <span>Category (comma seperated):</span>
        <input
          type='text'
          value={category.join(',')}
          onChange={(event) => setCategory(event.target.value.split(','))}
        />
      </div>
      <div className='form-line'>
        <span>Price:</span>
        <input
          type='text'
          value={price}
          onChange={(event) => setPrice(parseFloat(event.target.value))}
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
        <span>Quantity:</span>
        <input
          type='text'
          value={quantity}
          onChange={(event) => setQuantity(parseFloat(event.target.value))}
        />
      </div>
      <CodeEditor data={data} setData={setData} />
      <div className='form-line'>
        <input type='submit' id='send' value='Send' onClick={send} />
      </div>
    </>
  )
}

export default Item
