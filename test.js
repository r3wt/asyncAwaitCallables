var asyncAwaitCallables = require('./index');

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


var work = [functionWithErrorAndResult,functionWithNoResults,functionThrowsException,functionReturnsError];

asyncAwaitCallables(work,function(errors,results){
	if(errors){
		console.log(errors);
	}
	if(results){
		console.log(results);
	}
});


//now test timeouts

var functionNoReturn = function(next){
	
};

var functionReturns = function(next){
	next(null,'success');
};

var work2 = [functionNoReturn,functionReturns];

asyncAwaitCallables(work2,function(errors,results){
	if(errors){
		console.log(errors);
	}
	if(results){
		console.log(results);
	}
},'400ms');


//test invalid timeout

var invalidTimeout = 'aldfjlas';

asyncAwaitCallables(work2,function(errors,results){
	if(errors){
		console.log(errors);
	}
	if(results){
		console.log(results);
	}
},invalidTimeout);