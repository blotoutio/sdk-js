# API

## init
The `init` method is used for initializing SDK. This sets all required configurations and also sends system event `sdk_start` which allows it to record user.

#### Input
`trends('init', {token, endpointUrl, [customDomain], [storageRootKey]})`

|||||
|---|---|---|---|
| `token` | `String` |  | Application token that you can get in your dashboard |
| `endpointUrl` | `String` |  | Url where you will be sending data |
| `customDomain` | `String` | Optional | You can define the custom domain so that if you are developing for example on localhost things will be working correctly. |
| `storageRootKey` | `String` | Optional | Custom storage key that is used as a prefix for all storage keys (session and local storage). Default value is: `_trends`. |

## capture
The `init` method is used to record developer events. This allows you to send custom events to the server when a user is interacting with the website/app. For example, one custom event would be when a user adds an item to a cart.

If you are capturing an event when page navigation is triggered, you should add the method `beacon` in options so that you will not lose data.

#### Input
`trends('capture', eventName, [additionalData], [options])`

|||||
|---|---|---|---|
| `eventName` | `String` |  | Name of the event that you are sending |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options` | `Object` | Optional | Look at options table for more info |

#### Example
```js
trends('capture', 'add-to-cart')
trends('capture', 'add-to-cart', { SKU: '123123', itemName: 'phone'})
trends('capture', 'button-clicked', null, { method: 'beacon'})
trends('capture', 'form-submited', { email: 'user@domain.com' }, { PII: true})
```

## pageView
The `pageView` method should be used when you are doing navigation via History API or some other JS navigation mechanism. This way you are not losing events like `sdk_start` as is only triggered when SDK is initialized. This should not be used on regular websites/apps that use page reloads for navigation.

#### Example
```js
trends('pageView')
```

## mapID
The `mapID` method allows you to map external services to Blotout ID.

#### Input
`trends('mapID', externalID, provider, [additionalData], [options])`

|||||
|---|---|---|---|
| `externalID` | `String` |  | External ID that you want to link to Blotout ID |
| `provider` | `String` |  | Provider that generated external ID, for example `hubspot` |
| `additionalData` | `Object` | Optional | You can provide some additional data to this event. There is no limitation as this is just a key-value pair send to the server. |
| `options` | `Object` | Optional | Look at options table for more info |

#### Example
```js
trends('mapID', '92j2jr230r-232j9j2342j3-jiji', 'hubspot', { language: 'es' })
```

## getUserId
The `getUserId` method allows you to go get Blotout user id that is linked to all data that is sent to the server.

#### Output
Returns user ID as `string`.

#### Example
```js
const userId = trends('getUserId')
console.log(userId)
```


## Appendix
**Options**

|||||
|---|---|---|---|
| `method` | `String` | Optional | Allow options: `beacon` |
| `PII` | `Boolean` | Optional | If your `additionalData` contains personally identifiable information (PII) you should mark this as `true`.  |
| `PHI` | `Boolean` | Optional | If your `additionalData` contains protected health information (PII) you should mark this as `true`.|
