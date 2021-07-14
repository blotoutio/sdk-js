# Defined Events

## mapID

The `mapID` method allows you to map external services to Blotout ID.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `mapIDData`      | `Object` | Required | See data table.                                                                                                                 |
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
