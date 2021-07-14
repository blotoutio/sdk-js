# Basic API's

## init

The `init` method is used for initializing SDK. This sets all required configurations and also sends system event `sdk_start` which allows it to record user.

#### Input

|                  |          |          |                                                                                                                            |
| ---------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `token`          | `String` | Required | Application token that you can get in your dashboard.                                                                      |
| `endpointUrl`    | `String` | Required | Url where you will be sending data.                                                                                        |
| `storageRootKey` | `String` | Optional | Custom storage key that is used as a prefix for all storage keys (session and local storage). Default value is: `_trends`. |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('init', {
  token: '3WBQ5E48ND3VTPC',
  endpointUrl: 'https://domain.com/sdk',
})
```

{% endtab %}
{% tab basic node %}

```js
import { init } from '@blotoutio/sdk-core'

init({
  token: '3WBQ5E48ND3VTPC',
  endpointUrl: 'https://domain.com/sdk',
})
```

{% endtab %}
{% endtabs %}

## capture

The `capture` method is used to record developer events. This allows you to send custom events to the server when a user is interacting with the website/app. For example, one custom event would be when a user adds an item to a cart.

If you are capturing an event when page navigation is triggered, you should add the method `beacon` in options so that you will not lose data.

#### Input

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `eventName`      | `String` | Required | Name of the event that you are sending.                                                                                         |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options`        | `Object` | Optional | Look at options table for more info.                                                                                            |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('capture', 'add-to-cart')
trends('capture', 'add-to-cart', { SKU: '123123', itemName: 'phone' })
trends('capture', 'button-clicked', null, { method: 'beacon' })
```

{% endtab %}
{% tab basic node %}

```js
import { capture } from '@blotoutio/sdk-core'

capture('add-to-cart')
capture('add-to-cart', { SKU: '123123', itemName: 'phone' })
capture('button-clicked', null, { method: 'beacon' })
```

{% endtab %}
{% endtabs %}

## capturePersonal

Same as the method above (`capture`) `capturePersonal` is used to record developer events. The main difference is that `capturePersonal` should be used when you are sending personal information to the server. This payload will be encrypted on the client-side so that no personal data can be seen while going to the server or even on the server without appropriate permissions.

#### Input

|                  |           |          |                                                                                                                                                                                       |
| ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eventName`      | `String`  | Required | Name of the event that you are sending.                                                                                                                                               |
| `additionalData` | `Object`  | Required | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server.                                                       |
| `isPHI`          | `Boolean` | Optional | Define if data that you are sending is protected health information (PHI). If this is not defined or is set to `false`, data is treated as personally identifiable information (PII). |
| `options`        | `Object`  | Optional | Look at options table for more info.                                                                                                                                                  |

#### Example

{% tabs basic %}
{% tab basic browser %}
Note: you need to include a full package to use personal capture.

```js
trends('capturePersonal', 'form-submited', { email: 'user@domain.com' })
trends('capturePersonal', 'button-clicked', { bloodType: 'A+' }, true)
```

{% endtab %}
{% tab basic node %}

```js
import { capturePersonal } from '@blotoutio/sdk-personal'

capturePersonal('form-submited', { email: 'user@domain.com' })
capturePersonal('button-clicked', { bloodType: 'A+' }, true)
```

{% endtab %}
{% endtabs %}

## pageView

The `pageView` method should be used when you are doing navigation via History API or some other JS navigation mechanism. This way you are not losing events like `sdk_start` as is only triggered when SDK is initialized. This should not be used on regular websites/apps that use page reloads for navigation.

When you call this API we will send a request to the server that will contain two events in the payload. First in the array will be `visibility_hidden` event and then `sdk_start`. This mimics how regular navigation works.

|                  |          |          |                                                                                                                                 |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `previousUrl`    | `String` | Required | Previous page URL that will be sent as part of `visibility_hidden` event.                                                       |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('pageView', 'https://blotout.io')
```

{% endtab %}
{% tab basic node %}

```js
import { pageView } from '@blotoutio/sdk-core'

pageView('https://blotout.io')
```

{% endtab %}
{% endtabs %}

## getUserId

The `getUserId` method allows you to go get Blotout user id that is linked to all data that is sent to the server.

#### Output

Returns user ID as `string`.

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
const userId = trends('getUserId')
console.log(userId)
```

{% endtab %}
{% tab basic node %}

```js
import { getUserId } from '@blotoutio/sdk-core'

const userId = getUserId()
console.log(userId)
```

{% endtab %}
{% endtabs %}

## enable

The `enable` method allows you to enable or disable SDK. If you disable SDK, no event will be logged or send to the server, system, or codified. This setting is persisted in session. So a when new session is created this setting needs to be set again.

#### Input

|          |           |          |                                              |
| -------- | --------- | -------- | -------------------------------------------- |
| `enable` | `Boolean` | Required | Define if you want to enable or disable SDK. |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('enable', false)
```

{% endtab %}
{% tab basic node %}

```js
import { enable } from '@blotoutio/sdk-core'

enable(false)
```

{% endtab %}
{% endtabs %}

## defaultEventData

The `defaultEventData` method allows you to set data that will be sent to the server with every request for even type that you passed as the first parameter. You can also combine data for all events and a specific event. For example, if you have data for all events and then some data for a specific event. You can set both of them, and the system will combine all event types data + specific event data and send that to the server.

#### Input

|             |          |          |                                                                                                                                                                            |
| ----------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eventType` | `Array`  | Required | It's an array of events that you want to assign data to. Options are: `system`, `codified`, `pii`, `phi`. If you pass an empty array, data will be assigned to all events. |
| `data`      | `Object` | Required | Data that will be added to every event based on the type that you define. There is no limitation as this is just a key-value pair send to the server.                      |

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
trends('defaultEventData', ['codified'], { lang: 'fr' })
trends('defaultEventData', [], { plan: 'free' })
```

{% endtab %}
{% tab basic node %}

```js
import { defaultEventData } from '@blotoutio/sdk-core'

defaultEventData(['codified'], { lang: 'fr' })
defaultEventData([], { plan: 'free' })
```

{% endtab %}
{% endtabs %}

## isEnabled

The `isEnabled` method allows you to check if Blotout SDK is enabled or not.

#### Output

Returns `boolean`.

#### Example

{% tabs basic %}
{% tab basic browser %}

```js
const enabled = trends('isEnabled')
console.log(enabled)
```

{% endtab %}
{% tab basic node %}

```js
import { isEnabled } from '@blotoutio/sdk-core'

const enabled = getUserId()
console.log(enabled)
```

{% endtab %}
{% endtabs %}

## Appendix

**Options**

|          |          |          |                         |
| -------- | -------- | -------- | ----------------------- |
| `method` | `String` | Optional | Allow options: `beacon` |
