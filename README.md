# try.catch
## Simple performant try-catch wrapper.

This utility is used *in place of* regular `try/catch` blocks using a clean functional syntax. Execution is **fully synchronous**; this does not work with async methods

### Instead of this
```javascript

try {
    // do something
}
catch (err) {
    // handle errors
}
finally {
    // finally do something
}

```

### Do this
```javascript

var Try = require('try.catch');

Try(function () {
    // do something
})
.catch(function (err) {
    // handle errors
})
.finally(function () {
    // finally do something
});

```

It can also be used like this:

```javascript

function doSomething (x, y) {
    return this + x * y;
}

var result = Try(doSomething, 'test', 2, 3)     // pass context and arguments to function
.catch(function (err) {
    // err was thrown
})                                              // chain catch blocks
.catch(TypeError, function (err) {              // catch errors conditionally
    // TypeError was thrown
})
.finally(function (value, err) {
    // finally do something
});

console.log(result.value); // return value of function if any
console.log(result.error); // error thrown if any

```

See tests for full spec

----
### Tests
Run tests using `npm test`
