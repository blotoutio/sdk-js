# System Events

## Required events
Our SDK only needs to send two events by default. They are triggered when SDK loads and when a user leaves a page.

#### SDK start
`sdk_start` event is triggered as soon as initialization function is called via [`init`](/api.md#init) api. This allows us to record a user.

#### Page hide
`pagehide` is triggered when a user leaves the website/app. This allows us to calculate session time and navigation flow. To not block user interaction and reliable send data we use `beacon` method for interaction with the server. You can read more about this mechanism [here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon).

## Optional events
We support a lot more system events which you can enable via Manifest in your dashboard. Navigate to [https://[your-dashboard-url]/application/manifest]() and select application that which you are working with. In the list search for `SDK_Push_System_Events` and set the value to `1`. This will start sending optional system events as well. You can always turn them off, where you would set the value to `0`.

List of optional system events:
- dragStart
- dragEnd
- copy
- cut
- paste
- reset
- submit
- keyDown
- click
- doubleClick
- contextMenu
- hover
- online
- offline
- print
- hashChange
- scroll
- error
