fps-emitter
===========

Measures the FPS (frames per second) on the current page and emits the 
result whenever it changes. Designed to be run in the browser.

2.8kB minified+gzipped.

Install
-------

Via npm:

    npm install fps-emitter

Or via npmcdn:

```html
<script src="https://npmcdn.com/fps-emitter/dist/fps-emitter.min.js"></script>
```

Usage
-----

```js
var FpsEmitter = require('fps-emitter')
var fps = new FpsEmitter()

// Get the current FPS, as an integer between 0 and 60:
var currentFps = fps.get()

// Or get notified whenever it changes:
fps.on('update', function (newFps) {
   console.log('FPS is: ', newFps)
})
```

### Update interval

By default, samples are collected every 1000 milliseconds. You can change this
either in the constructor or via a runtime API:

```js
var fps = new FpsEmitter(2000); // Update every 2000 milliseconds, from the start

fps.setUpdateInterval(2000); // Change the update interval at runtime
```

### EventEmitter

This is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 
that only emits one event, `'update'`. 
Standard idioms like `on()`, `.once()`, and `removeListener()` all apply.

### Debug vs production mode

Once you call the constructor (`new FpsEmitter()`), it starts tracking the global FPS using
`requestAnimationFrame()`. Simply measuring the FPS has the potential to cause slowdowns, so
you may want to disable it in production:

```js
if (DEBUG_MODE) {
  var fps = new FpsEmitter()
  // etc.
} else {
  // do nothing
}
```

Testing
-------

    npm install
    npm test
