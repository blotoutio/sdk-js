[![codecov](https://codecov.io/gh/blotoutio/sdk-js/branch/main/graph/badge.svg?token=4NVM8A3SW2)](https://codecov.io/gh/blotoutio/sdk-js)

# Blotout JS SDK

You can test the latest version [here](https://jsdemo.blotout.io)

## Integration

### Option 1:
```html
<script>
!function(){window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};const t=document.createElement("script");t.type="text/javascript",t.src="https://download.blotout.io/sdkrc/trends.js",t.async=!0;const e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();
</script>
```

<details>
<summary>Click to show non-minified version</summary>

```html
<script>
(function () {
  window.trends = window.trends || function() {
    (trends.stubs = trends.stubs || []).push(arguments)
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://download.blotout.io/sdkrc/trends.js'
  script.async = true

  const element = document.getElementsByTagName('script')[0]
  element.parentNode.insertBefore(script, element)
})()
</script>
```

</details>

### Option 2:
```html
<script>
window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};
</script>
<script async src='https://download.blotout.io/sdkrc/trends.js'></script>
```
<details>
<summary>Click to show non-minified version</summary>

```html
<script>
(function () {
  window.trends = window.trends || function() {
    (trends.stubs = trends.stubs || []).push(arguments)
  }
})()
</script>
<script async src='https://download.blotout.io/sdkrc/trends.js'></script>
```

</details>

## Initialization
After you include the snippet you just need to call init function:
```js
trends('init', {
  token: '[TOKEN]',
  endpointUrl: '[SDK_ENDPOINT]',
  customDomain: '[DOMAIN]'
})
```
