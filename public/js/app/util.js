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
		
		var items = $.pluck($g.dataTypes, ['id', 'name']);
		var si = 0;
		
		// set string as the default data type
		$.each(items, function(idx, item) {
			if (item.name === 'string') {
				si = idx;
			}
		});
		
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
		    	items: items,
		    	selectedIndex: si
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
		    	name: 'required',
		    	title: 'Required',
		    	type: 'checkbox'
		    },
		    {
		    	name: 'use_current',
		    	title: 'Current',
		    	type: 'checkbox'
		    },
		    {
		    	type: 'control'
		    }
	    ];
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
	
	
	// return functions
	return {
		select: select,
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