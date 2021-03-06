# Middlewares 

[Full documentation](./README.md)

---

*By adding a middleware you are hooking to some internal lifecycle processes of Stent. Changing state or firing methods are this point may lead to bugs so avoid doing it.*

If you want to extend the library with some additional functionalities you may add a middleware. In fact Stent uses middleware internally for implementing the `connect` helper. We have to call `addMiddleware` with a single parameter which is an object with a set of functions that hook to the lifecycle methods of Stent.

```js
import { Machine } from 'stent';

Machine.addMiddleware({
  onActionDispatched(actionName, ...args) {
    // ...
  },
  onActionProcessed(actionName, ...args) {
    // ...
  },
  onStateWillChange() {
    // ...
  },
  onStateChanged() {
    // ...
  },
  onGeneratorStep(yielded) {
    // You'll probably never need this hook.
    // It gets fired when you yield something in a generator
    // as an action handler.
  }
});
```

Have in mind that these methods are fired with the machine as a context. Which means that we have an access to the current state and methods via a `this.<something>` notation.

*If you have more then one middleware to add pass an array of objects instead of multiple calls of `addMiddleware`.*

There are is one build-in middleware which is part of the Stent package - `Logger`.

**`Logger`**

It prints out some useful stuff in the dev tools console.

![Logger](./_images/Logger.png)

```js
import { Machine } from 'stent';
import { Logger } from 'stent/lib/middlewares';

Machine.addMiddleware(Logger);
```

---

[Full documentation](./README.md)