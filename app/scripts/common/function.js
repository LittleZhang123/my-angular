'use strict';

Array.prototype.contains = function(val){ 
	for(var i=0; i<this.length; i++){ 
		if(this[i] == val) 
			return true; 
	} 
	return false; 
}
String.prototype.format = function(args) { 
	if (arguments.length>0) { 
		var result = this; 
		if (arguments.length == 1 && typeof (args) == "object") { 
			for (var key in args) { 
				var args_key;
				var reg=new RegExp ("({"+key+"})","g"); 
				if(typeof(args[key])=="object"){
					args_key=JSON.stringify(args[key]);
					args_key=args_key.replace(new RegExp ("\"","g"),"'");
				}else{
					args_key=args[key];
				}
				result = result.replace(reg, args_key); 
			} 
		} 
		else { 
			for (var i = 0; i < arguments.length; i++) { 
				if(arguments[i]==undefined) 
				{ 
					return ""; 
				} 
				else 
				{ 
					var args_key;
					var reg=new RegExp ("({["+i+"]})","g"); 
					if(typeof(arguments[i])=="object"){
						args_key=JSON.stringify(arguments[i]);
						args_key=args_key.replace(new RegExp ("\"","g"),"'");
					}else{
						args_key=arguments[i];
					}
					result = result.replace(reg, arguments[i]); 
				} 
			} 
		} 
		return result; 
	} 
	else { 
		return this; 
	} 
} 