# Integration

We provide two options of implementing our SDK:

- **Browser**: including a snippet in your website directly
- **Node**: if you are working with Node and NPM you can include it with installing our packages

{% tabs basic %}
{% tab basic browser %}
**Basic** (system events + codified api + ID mapping): (~32kb / ~13kb gzip) - [Download](https://unpkg.com/@blotoutio/sdk-browser/index.min.js)

**Full** (basic + PII and PHI support): (~95kb / ~32kb gzip) - [Download](https://unpkg.com/@blotoutio/sdk-browser/index.full.min.js)

## Snippet

You can select from two options how to implement our snippet.

The first option is supported in an older browser as well as it created script tag in runtime, and the async flag will be respected correctly. This option is also useful if you work only with JS and you don't want to put a script tag in your HTML.

The second approach is for modern browsers as we put script download in a separate script tag and put the async flag indirectly. This simplifies our snippet a lot as it's now a one-liner.

When you select which snippet you prefer, the only thing you need to do is replace `[SDK_URL]` with URL where you host your JavaScript of SDK package.

The snippet should be put in before the closing head tag `</head>`. This way snippet can work at its best. We are using asynchronous through our SDK, as well for loading, so your website/app will not have any performance impacts.

### Option 1:

Minified version:

```html
<script>
!function(u){window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};const t=document.createElement("script");t.type="text/javascript",t.src=u,t.async=!0;const e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}("[SDK_URL]");
</script>
```

Non-minified version

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

### Option 2:

Minified version:

```html
<script>
window.trends=window.trends||function(){(trends.stubs=trends.stubs||[]).push(arguments)};
</script>
<script async src="[SDK_URL]"></script>
```

Non-minified version

```html
<script>
(function () {
  window.trends = window.trends || function() {
    (trends.stubs = trends.stubs || []).push(arguments)
  }
})()
</script>
<script async src="[SDK_URL]"></script>
```

{% endtab %}
{% tab basic node %}
**Basic** (system events + codified api + ID mapping): `npm i @blotoutio/sdk-core`

**Full** (basic + PII and PHI support): `npm i @blotoutio/sdk-core @blotoutio/sdk-personal`
{% endtab %}
{% endtabs %}

## Initialization

After completing step above you just need to call init function, and you are good to go.
{% tabs basic %}
{% tab basic browser %}

```js
trends('init', {
  token: '[TOKEN]',
  endpointUrl: '[SDK_ENDPOINT]',
})
```

{% endtab %}
{% tab basic node %}

```js
import { init } from '@blotoutio/sdk-core'

init({
  token: '[TOKEN]',
  endpointUrl: '[SDK_ENDPOINT]',
})
```

{% endtab %}
{% endtabs %}

You can read more about `init` API in [API docs](api.md#init)
