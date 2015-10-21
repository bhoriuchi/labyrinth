/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global'], function($, $g) {
	
	$.pluck = function(arr, key, fn) {
		
		if (typeof(fn) !== 'function') {
			fn = function() {return true;};
		}
		
	    return $.map(arr, function(e) {
	    	if (Array.isArray(key)) {
	    		var item = {};
	    		for (var i = 0; i < key.length; i++) {
	    			if (e.hasOwnProperty(key[i])) {
	    				item[key[i]] = e[key[i]];
	    			}
	    		}
	    		if (fn(e)) {
	    			return item;
	    		}
	    	}
	    	else if (fn(e)) {
	    		
	        	return e[key];
	    	}
	    });
	};
	
	var getURLParameter = function(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(document.location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	};

	
	var select = function(arr, fn) {
		
		if (!Array.isArray(arr) || typeof(fn) !== 'function') {
			return null;
		}
		
		for(var i = 0; i < arr.length; i++) {
			if (fn(arr[i], i) === true) {
				return arr[i];
			}
		}
		return null;
	};
	
	
	var filter = function(arr, fn) {
		
		var out = [];
		
		if (!Array.isArray(arr) || typeof(fn) !== 'function') {
			return null;
		}
		
		for(var i = 0; i < arr.length; i++) {
			if (fn(arr[i], i) === true) {
				out.push(arr[i]);
			}
		}
		return out;
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
	
	
	var ioParameters = function(type) {
		
		var items = $.pluck($g.dataTypes, ['id', 'name']);
		var si    = 0;

		
		// set string as the default data type
		$.each(items, function(idx, item) {
			if (item.name === 'string') {
				si = idx;
			}
		});
		
		var cfg = [
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
		    	items: items,
		    	selectedIndex: si
		    },
		    {
		    	name: 'mapAttribute',
		    	title: 'Bind Attribute',
		    	type: 'select',
		    	valueField: 'id',
		    	textField: 'name',
		    	items: [{id: null, name: ''}].concat($.pluck($g.attributes, ['id', 'name']))
		    },
		    {
		    	name: 'description',
		    	title: 'Description',
		    	type: 'text'
		    }
		];
		
		// if an input, show the required checkbox
		if (type === 'input') {
			cfg.push({
		    	name: 'required',
		    	title: 'Required',
		    	type: 'checkbox'
		    });
		}
		
		// current
		cfg.push({
	    	name: 'use_current',
	    	title: 'Current',
	    	type: 'checkbox'
	    });
		cfg.push({
	    	type: 'control'
	    });
		
		return cfg;
	};
	
	var errorDialog = function(title, message) {
		$('#wf-error-modal-detail').html(message);
		$g.errorModal.dialog('option', 'title', title);
		$g.errorModal.dialog('open');
	};
	
	var okDialog = function(title, message) {
    	$('#wf-ok-modal-detail').html(message);
		$g.okModal.dialog('option', 'title', title);
		$g.okModal.dialog('open');
	};
	
	var confirmDialog = function(title, message, callback, args) {
		args = args || null;
		args = Array.isArray(args) ? args : [args];
		$('#wf-confirm-button').off();
		
		$('#wf-confirm-button').on('click', function() {
			if (typeof(callback) === 'function') {
				callback.apply(null, args);
			}
			else {
				$g.confirmModal.dialog('close');
			}
		});
		
		$('#wf-confirm-modal-detail').html(message);
		$g.confirmModal.dialog('option', 'title', title);
		$g.confirmModal.dialog('open');
	};
	
	
	
	var updateParams = function(id, parameters) {
		
		
		$g.steps[id]._input  = [];
		$g.steps[id]._output = [];
    	
    	$.each(parameters, function(paramId, param) {
    		
    		// create a new field to reference the data type id
    		if (param.dataType) {
    			if (param.dataType.id) {
    				param.dataTypeId = param.dataType.id;
    			}
    			else {
    				param.dataTypeId = param.dataType;
    			}
    		}
    		
    		
    		if (param.type === 'input') {
    			$g.steps[id]._input.push(param);
    		}
    		else if (param.type === 'output') {
    			$g.steps[id]._output.push(param);
    		}
    		else {
    			$g.steps[id]._input.push(param);
    		}
    	});
	};
	
	
	// return functions
	return {
		updateParams: updateParams,
		select: select,
		filter: filter,
		confirmDialog: confirmDialog,
		okDialog: okDialog,
		errorDialog: errorDialog,
		exists: exists,
		getURLParameter: getURLParameter,
		removeBlanks: removeBlanks,
		findStep: findStep,
		ioParameters: ioParameters
	};
});