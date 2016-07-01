function timeParse(t)
{
	if(typeof t == 'string'){
		var m = t.match(/^(\d+)(MS|S|M|H|ms|s|m|h)$/);
		if(m instanceof Array && m.length == 3){
			var a = ~~m[1],
				b = m[2].toLowerCase(),
				c = {
					ms: 1,
					s : 1000,
					m : 60000,
					h : 3.6e+6
				};
			t = a * c[b];
		}else{
			t = -1;
		}
	}
	if(typeof t != 'number'){
		t = -1;
	}
	return t;
}

module.exports = function asyncAwaitCallables(arr,cb,timeout){
	
	if(!arr || !arr instanceof Array){
		throw new Error('asyncAwaitCallables expects parameter `arr` to be of type Array');
	}
	
	if(!cb || typeof cb != 'function'){
		throw new Error('asyncAwaitCallables expects parameter `cb` to be of type Function');
	}
	
	if( !arr.every(function(v){ return typeof v == 'function'; }) ){
		throw new Error('asyncAwaitCallables expects an of type Array with elements of type Function. Non Function Values detected');
	}
	
	if(!arr.length){
		console.error('asyncAwaitCallables cannot operate on an empty array. callback invoked with undefined values.');
		cb(undefined,undefined);
	}
	
	var err = [];//error array
	var res = [];//result array
	var ret = new Array(arr.length).fill(0);//use zero filled array instead of an incrementor to track progress.
	//next is responsible for updating its index with a 1 to signify completion of its unit of work.
	
	if(timeout){
		var ms = timeParse(timeout);//parse the timeout into a millisecond value.
		
		//the timeout could not be understood
		if(ms == -1){
			throw new Error('asyncAwaitCallables was unable to parse parameter `timeout` with value `'+timeout.toString()+'`');
		}
		var tim = new Array(arr.length).fill(null);//setup indexed timeout array of length to store timeouts.
	}
	
	arr.forEach(function(v,i){
		//provide context specific next function to insulate from race conditions
		var next = function(e,r){
			//prevent dupes in err/res/ret stacks 
			if(ret[i] == 0){
				
				if(timeout){
					clearTimeout(tim[i]);	
				}
				
				if(e){
					err.push(e);
				}
				
				if(r){
					res.push(r);
				}
				
				ret[i] = 1;//update index to signify completion of unit of work
				
				//check ret stack to see if all work has returned.
				if(ret.indexOf(0) == -1){
					var e = err.length > 0 ? err : undefined;
					var r = res.length > 0 ? res : undefined;
					//all work returned, invoke callback with errors/results if they exist.
					cb(e,r);
				}		
			}
			
		};
		
		//insulate the callstack from any exception that might be thrown in a callable.
		try{
			if(timeout){
				tim[i] = setTimeout(function(){ next('Maximum Timeout Exceeded'); },ms);
			}
			v(next);
		}
		catch(e){
			//we dont know if next was called before exception occured. 
			//calling next here with error insures stack eventually completes, and callback is invoked.
			next(e);
		}
		
	});
	
};