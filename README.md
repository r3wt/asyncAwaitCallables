### Async Await Callables.



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
 