# Migration

## 0.8.x -> 0.9.0

### mapID
With version 0.9.0 we introduced defined events, that can help you track things consistently across the system. To accommodate this change we unified how API looks for defined events, which `mapID` is one of them.

Old code
```js
// HTML
trends('mapID', '92j2jr230r-232j9j2342j3-jiji', 'hubspot')

// npm
mapID('92j2jr230r-232j9j2342j3-jiji', 'hubspot')
```

New code
```js
// HTML
trends('mapID', { externalID: '92j2jr230r-232j9j2342j3-jiji', provider: 'hubspot' })

// npm
mapID({ 
  externalID: '92j2jr230r-232j9j2342j3-jiji', 
  provider: 'hubspot' 
})
```

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
  customDomain: '[DOMAIN]',
})
```

```js
// New code
trends('init', {
  token: '[TOKEN]',
  endpointUrl: '[URL]',
  customDomain: '[DOMAIN]',
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
// New code
trends('capture', 'click-logo', { language: 'en' })
trends('capture', 'user-submited', { email: 'user@domain.com' }, { PII: true })
```
