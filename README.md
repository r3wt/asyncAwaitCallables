# Async Await Callables.

# install

```
npm install --save async-await-callables
```

# signature

void asyncAwaitCallables( Array, Callback[, Timeout])

Array (required,Array) - Array of Functions. type is checked, exception thrown.
Callback (required,Function) - Function. type is checked, exception thrown
Timeout  (optional,Mixed) - Either a string or number of milliseconds. valid strings are `100ms`,`10m`,'1h`,`100MS`,`10M`,'1H`. If time cannot be parsed to millisecond value, exception is thrown.


# implementation details

- callstack insulated against thrown errors
- zero filled array with index specific next function insures no early return. see source for details.
- timeouts can be used to insure your callback always is invoked. timeout is per callable, not for entire work. if timeout is exceeded, timeout error is pushed into error stack.


# basic usage

```js

var asyncAwaitCallables = require('async-await-callables');

var work = [];

var functionWithErrorAndResult = function(next){
	next(null,['foo','bar']);
};

var functionWithNoResults = function(next){
	next();
};

var functionThrowsException = function(next){
	throw new Error('The fit hit the shan');
};

var functionReturnsError = function(next){
	next('something bad happened');
};


var work = [functionWithErrorAndResult,functionWithNoResults,functionThrowsException,functionRetursError];

asyncAwaitCallables(work,function(errors,results){
	if(errors){
		console.log(errors);
	}
	if(results){
		console.log(results);
	}
});


```

# use cases

 - I wrote the library so i could do multiple complex mongoosejs operations before sending a response from a very complex api method.
 - After going on to use it in a few more projects, i figured i might share it. it really has made my life more enjoyable for writing express apps.
 