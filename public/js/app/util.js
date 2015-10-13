/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery'], function($) {
	
	$.pluck = function(arr, key) {
	    return $.map(arr, function(e) {
	    	if (Array.isArray(key)) {
	    		var item = {};
	    		for (var i = 0; i < key.length; i++) {
	    			if (e.hasOwnProperty(key[i])) {
	    				item[key[i]] = e[key[i]];
	    			}
	    		}
	    		return item;
	    	}
	    	else {
	        	return e[key];
	    	}
	    });
	};
	
	var getURLParameter = function(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(document.location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	};



	var removeBlanks = function(obj) {
		for (var i = obj.length - 1; i >= 0; i--) {
			if (!obj[i].name || obj[i].name === '') {
				obj.splice(i, 1);
			}
		}
	};
	
	
	/**
	 * function to find the html id of a step
	 */
	var findStep = function(id, data) {
		for (var i = 0; i < data.steps.length; i++) {
			if (data.steps[i].id === id) {
				return data.steps[i].htmlId;
			}
		}
		return null;
	};
	
	// return functions
	return {
		getURLParameter: getURLParameter,
		removeBlanks: removeBlanks,
		findStep: findStep
	};
});