# Plum Lightpad

## Synopsis

npm module to communicate with plum lightpad switches. https://plumlife.com/

## Code Example

```js
let Plum = require('plum-lightpad');

Plum.discover('username', 'password').subscribe((lightpad) => {
    console.log(lightpad);
    lightpad.setLevel(50);
});
```

## Installation

```bash
npm install plum-lightpad --save
```

## API Reference

### `Plum.discover(username, password)`
Merge device info from the cloud with devices found on the local network. Only devices found both in the cloud account and on the local network are returned.

#### Arguments
1. `username` *(string)*: username for the user's plum account
1. `password` *(string)*: password for the user's plum account

#### Returns
*(`Observable<lightpad>`)*: an observable sequence of PlumLightpad devices.

#### Example
```js
let Plum = require('plum-lightpad');
Plum.discover('username', 'password').subscribe((lightpad) => {
    console.log(lightpad);
});
```

### `lightpad.getMetrics(), lightpad.getLevel()`
Query the lightpad device for current logical load, brightness level and power consumption

#### Returns
*(`Promise<LogicalLoadMetrics>`)*: a promise containing info about the logical load including level and power usage

#### Example
```js
let Plum = require('plum-lightpad');
Plum.discover('username', 'password').subscribe((lightpad) => {
    lightpad.getMetrics().then((metrics) => {
        console.log(metrics);
    });
});
```

### `lightpad.setLevel(level)`
Set the current brightness level

#### Arguments
1. `level` *(number)*: brightness level 0-255

#### Returns
*(`Promise`)*: a promise that resolves when the brightness has been set

#### Example
```js
let Plum = require('plum-lightpad');
Plum.discover('username', 'password').subscribe((lightpad) => {
    lightpad.setLevel(200);
});
```

### `lightpad.events`
Event stream from the lightpad

#### Returns
*(`Observable<Event>`)*: an observable sequence of events emitted by the lightpad

#### Example
```js
let Plum = require('plum-lightpad');
Plum.discover('username', 'password').subscribe((lightpad) => {
    lightpad.events.subscribe((event) => {
        console.log(event);
    });
});
```

### `lightpad.post(url, [data])`
A primarily internal method to send HTTP posts requests to the lightpad. This method handles setting the appropriate auth headers for you.

#### Arguments
1. `url` *(string)*: the url path to post to
1. `[data]` *(object)*: the post body

#### Returns
*(`Promise<HttpResponse>`)*: a promise of the HTTP response

#### Example
```js
let Plum = require('plum-lightpad');
Plum.discover('username', 'password').subscribe((lightpad) => {
    lightpad.post('/v2/getLogicalLoadMetrics', { llid: '12345678-1234-1234-1234' }).then((response) => {
        console.log(response);
    });
});
```