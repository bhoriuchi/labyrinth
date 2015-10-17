/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global'], function($, $g) {
	
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


	/**
	 * function to check if a path exists in an object and return the value
	 */
	var exists = function(obj, path, nullValue) {
		
		nullValue = (!nullValue && nullValue !== '') ? null : nullValue;
		
		// check that the object exists
		if (!obj || typeof(obj) !== 'object' || Array.isArray(obj) || typeof(path) !== 'string') {
			return nullValue;
		}
		
		// split the path
		path = path.split('.');
		
		for(var i = 0; i < path.length; i++) {
			
			if (obj[path[i]]) {
				obj = obj[path[i]];
			}
			else {
				return nullValue;
			}
		}
		return obj;
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
	
	
	var ioParameters = function() {
		return [
		    {
		    	name: 'name',
		    	title: 'Name',
		    	type: 'text'
		    },
		    {
		    	name: 'dataTypeId',
		    	title: 'Type',
		    	type: 'select',
		    	valueField: 'id',
		    	textField: 'name',
		    	items: $.pluck($g.dataTypes, ['id', 'name'])
		    },
		    {
		    	name: 'mapAttribute',
		    	title: 'Bind Attribute',
		    	type: 'select',
		    	valueField: 'id',
		    	textField: 'name',
		    	items: [{id: '', name: 'None'}].concat($.pluck($g.attributes, ['id', 'name']))
		    },
		    {
		    	name: 'description',
		    	title: 'Description',
		    	type: 'text'
		    },
		    {
		    	type: 'control'
		    }
	    ];
	};
	
	// return functions
	return {
		exists: exists,
		getURLParameter: getURLParameter,
		removeBlanks: removeBlanks,
		findStep: findStep,
		ioParameters: ioParameters
	};
});