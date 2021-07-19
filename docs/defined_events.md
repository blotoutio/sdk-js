# Defined Events

## mapID

The `mapID` method allows you to map external services to Blotout ID.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `data`      | `Object` | Required | See data table.                                                                                                                 |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options`        | `Object` | Optional | Look at options table for more info.                                                                                            |

#### Data

|              |          |          |                                                            |
| ------------ | -------- | -------- | ---------------------------------------------------------- |
| `externalID` | `String` | Required | External ID that you want to link to Blotout ID.           |
| `provider`   | `String` | Required | Provider that generated external ID, for example `hubspot` |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('mapID', {
  externalID: '92j2jr230r-232j9j2342j3-jiji',
  provider: 'hubspot',
})
trends(
  'mapID',
  { externalID: '92j2jr230r-232j9j2342j3-jiji', provider: 'hubspot' },
  { language: 'es' }
)
```

{% endtab %}
{% tab basic node %}

```js
import { mapID } from '@blotoutio/sdk-events'

mapID({
  externalID: '92j2jr230r-232j9j2342j3-jiji',
  provider: 'hubspot',
})
mapID(
  {
    externalID: '92j2jr230r-232j9j2342j3-jiji',
    provider: 'hubspot',
  },
  { language: 'es' }
)
```

{% endtab %}
{% endtabs %}

## transaction

The `transaction` method allows you to record tranasctions in your system, like purchase in ecommerce.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `data`      | `Object` | Required | See data table.                                                                                                                 |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options`        | `Object` | Optional | Look at options table for more info.                                                                                            |

#### Data

|              |          |          |                                                            |
| ------------ | -------- | -------- | ---------------------------------------------------------- |
| `ID` | `String` | Required | Transaction ID.           |
| `currency`   | `String` | Optional | Currency used for the transaction. Example: `EUR` |
| `payment`   | `String` | Optional | Payment type used in the transaction. Example: `credit-card` |
| `total`   | `Double` | Optional | Total amount for the transaction. Example `10.50` |
| `discount`   | `Double` | Optional | Discount that was applied in the transaction. Example: `2.1` |
| `shipping`   | `Double` | Optional | Shipping that was charged in the transaction. Example: `5.0` |
| `tax`   | `Double` | Optional | How much tax was applied in the transaction. Example: `1.21` |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('transaction', { ID: '123423423', currency: 'EUR', total: 10.5 })
trends(
  'transaction',
  { ID: '123423423', currency: 'EUR', total: 10.5 },
  { language: 'es' }
)
```

{% endtab %}
{% tab basic node %}

```js
import { transaction } from '@blotoutio/sdk-events'

transaction({ ID: '123423423', currency: 'EUR', total: 10.5 })
transaction(
  { ID: '123423423', currency: 'EUR', total: 10.5 },
  { language: 'es' }
)
```

{% endtab %}
{% endtabs %}

## item

The `item` method allows you to record item in your system, like add to cart in ecommerce.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `data`      | `Object` | Required | See data table.                                                                                                                 |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options`        | `Object` | Optional | Look at options table for more info.                                                                                            |

#### Data

|              |          |          |                                                            |
| ------------ | -------- | -------- | ---------------------------------------------------------- |
| `ID` | `String` | Required | Item ID.           |
| `name`   | `String` | Optional | Example: `Phone 4` |
| `SKU`   | `String` | Optional | Example: `SHOP-01` |
| `category`   | `Array` | Optional | Example `['mobile', 'free-time]` |
| `currency`   | `String` | Optional | Currency of item price. Example: `EUR` |
| `price`   | `Double` | Optional | Example: `2.1` |
| `quantity`   | `Double` | Optional | Example: `3` |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('item', { ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 })
trends(
  'item',
  { ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 },
  { language: 'es' }
)
```

{% endtab %}
{% tab basic node %}

```js
import { item } from '@blotoutio/sdk-events'

item({ ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 })
item(
  { ID: '123423423', currency: 'EUR', price: 10.5, quantity: 2 },
  { language: 'es' }
)
```

{% endtab %}
{% endtabs %}

## persona

The `persona` method allows you to record persona in your system, like when user signs up or saves user profile.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `data`      | `Object` | Required | See data table.                                                                                                                 |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options`        | `Object` | Optional | Look at options table for more info.                                                                                            |

#### Data

|              |          |          |                                                            |
| ------------ | -------- | -------- | ---------------------------------------------------------- |
| `ID` | `String` | Required | Persona ID.           |
| `firstname`   | `String` | Optional | Example: `John` |
| `lastname`   | `String` | Optional | Example: `Smith` |
| `middlename`   | `String` | Optional | Example `Jack` |
| `username`   | `String` | Optional | Example: `jsmith` |
| `dob`   | `String` | Optional | Date of birth. Example: `04/30/2000` |
| `email`   | `String` | Optional | Example: `john@domain.com` |
| `number`   | `String` | Optional | Example: `+386 31 777 444` |
| `address`   | `String` | Optional | Example: `Street 1` |
| `city`   | `String` | Optional | Example: `San Francisco` |
| `state`   | `String` | Optional | Example: `CA` |
| `zip`   | `Double` | Optional | Example: `10000` |
| `country`   | `String` | Optional | Example: `US` |
| `gender`   | `String` | Optional | Example: `Female` |
| `age`   | `Double` | Optional | Example: `22` |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('persona', { ID: '3434343', gender: 'female', age: 22 })
trends(
  'persona',
  { ID: '3434343', gender: 'female', age: 22 },
  { language: 'es' }
)
```

{% endtab %}
{% tab basic node %}

```js
import { persona } from '@blotoutio/sdk-events'

persona({ ID: '3434343', gender: 'female', age: 22 })
persona(
  { ID: '3434343', gender: 'female', age: 22 },
  { language: 'es' }
)
```

{% endtab %}
{% endtabs %}
