# Integration

Choose between two packages that you can put on your website/app:
- **basic**: (system events + codified api + ID mapping) (~33kb / ~13kb gzip)
- **full**: (basic + PII and PHI support) (~96kb / ~32kb gzip)

## Snippet

You can select from two options how to implement our snippet. 

The first option is supported in an older browser as well as it created script tag in runtime, and the async flag will be respected correctly. This option is also useful if you work only with JS and you don't want to put a script tag in your HTML.

The second approach is for modern browsers as we put script download in a separate script tag and put the async flag indirectly. This simplifies our snippet a lot as it's now a one-liner.

When you select which snippet you prefer, the only thing you need to do is replace `[SDK_URL]` with URL where you host your JavaScript of SDK package.

The snippet should be put in before the closing head tag `</head>`. This way snippet can work at its best. We are using asynchronous through our SDK, as well for loading, so your website/app will not have any performance impacts. 

### Option 1:
```html
<script>
!function(u){window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};const t=document.createElement("script");t.type="text/javascript",t.src=u,t.async=!0;const e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}("[SDK_URL]");
</script>
```

<details>
<summary>Click to show non-minified version</summary>

```html
<script>
(function (url) {
  window.trends = window.trends || function() {
    (trends.stubs = trends.stubs || []).push(arguments)
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  script.async = true

  const element = document.getElementsByTagName('script')[0]
  element.parentNode.insertBefore(script, element)
})('[SDK_URL]')
</script>
```

</details>

### Option 2:
```html
<script>
window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};
</script>
<script async src='[SDK_URL]'></script>
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
<script async src='[SDK_URL]'></script>
```

</details>

## Initialization
After you include the snippet you just need to call init function, and you are good to go.
```js
trends('init', {
  token: '[TOKEN]',
  endpointUrl: '[SDK_ENDPOINT]'
})
```

You can read more about `init` API in [API docs](api.md#init)
