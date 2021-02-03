# Migration

## 0.4.x -> 0.5.0

### Snippet
We have a new snippet that is more performant and is needed for a new version to work. You can find it on [integration page](integration.md).

### API
To make our API more performant and make it compatible with a new snippet we changed the signature of the API. Bellow, you can find a couple of examples of how to migrate to new code.


#### Init
```js
// Old code

bojs.init({
  token: '[TOKEN]',
  endpointUrl: '[URL]',
  customDomain: '[DOMAIN]'
})
```


```js
// New Code

trends('init', {  
  token: 'ZWBQ5E48ND3VTPB',
  endpointUrl: 'https://sales.blotout.io/sdk',
  customDomain: 'blotout.io'
})
```

#### Log events
To unify all events we renamed event logging from `logEvent` to `capture`. This allows you to have one api for all events. If you now want to send `PII` or `PHI` event you just define this in capture options.

```js
// Old code
bojs.logEvent('click-logo', { language: 'en' })
bojs.PII('user-submited', { email: 'user@domain.com' })
```

```js
// New Code
trends('capture', 'click-logo', { language: 'en' })
trends('capture', 'user-submited', { email: 'user@domain.com' }, { PII: true })
```
