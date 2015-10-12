

/**
 * variables used through out
 */
var $steps = {};
var $attributes = [];
var $inputs = [];
var $outputs = [];
var $elements = [];
var $menuLoaded, $activities, $workflows, $header, $toolbar, $wf;
var $panzoom, $workarea, $viewport, $menu, $menutoggle, $iconSize;
var $droparea, $editmodal, $edittabs, $codemirror, $codefield;
var $wfmodal, $vermodal, $errormodal, $confirmmodal, $okmodal;

var $okheight   = 300;
var $okwidth    = 400;
var $editheight = 570;
var $editwidth  = 750;
var $activetab  = 0;
var $modaltop   = '+15%';
var $smmodaltop = '+33%';
var $wfpath     = '/api/wf';

// get a new instance of jsplumb
var $diagram = jsPlumb.getInstance();

// define endpoint locations
var $conn = {
	success: 'Right',
	fail: 'Bottom',
	exception: 'Top',
	target: 'Left'
};

/**
 * gets url path param - http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
 */
var getURLParameter = function(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(document.location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};

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

var _removeBlanks = function(obj) {
	for (var i = obj.length - 1; i >= 0; i--) {
		if (!obj[i].name || obj[i].name === '') {
			obj.splice(i, 1);
		}
	}
};



var publish = function(force) {

	var forceQs = (force === true) ? '?force=true' : '';
	$vermodal.dialog('close');
	
    $.ajax({
        url : $wfpath + '/workflows/' + $wf.id + '/publish' + forceQs,
        method : 'POST',
        crossDomain : true,
        headers : {
            'Accept' : 'application/json'
        },
        dataType: 'json',
        contentType: 'application/json'
    })
    .done(function(data, status, xhr) {
    	console.log('published',data);
    })
    .fail(function(xhr, status, err) {
    	
    	if (xhr.responseJSON && xhr.responseJSON.error === 'ER_COULD_NOT_PUBLISH_RELATION') {
    		$('#wf-confirm-modal-detail').html('<span class="glyphicon glyphicon-question-sign" style="font-size:50px;color:#FDBD02;float:left;margin-left:25px;margin-top:25px;display:inline;width:30px;"></span><div style="float:right;display:inline;width:250px;margin-top:25px;margin-right:25px;">' + xhr.responseJSON.details[0] + '</div>');
    		$confirmmodal.dialog('option', 'title', '<span class="glyphicon glyphicon-question-sign"></span> Force Publish?');
    		$confirmmodal.dialog('open');
    		console.log(xhr.responseJSON.details[0]);
    	}
    	else {
    		console.log(xhr);
    	}
    });
};



var versionOptions = function() {
	
	$('#wf-version-comment').val($wf.change_notes);

	if ($wf.active) {
		$('#wf-activate-btn').removeClass('btn-success').addClass('btn-default').prop('disabled', true);
		$('#wf-deactivate-btn').removeClass('btn-default').addClass('btn-danger').prop('disabled', false);
	}
	else {
		$('#wf-activate-btn').removeClass('btn-default').addClass('btn-success').prop('disabled', false);
		$('#wf-deactivate-btn').removeClass('btn-danger').addClass('btn-default').prop('disabled', true);
	}
	
	$vermodal.dialog('option', 'title', 'Version Options - ' + $wf.name);
	$vermodal.dialog('open');
};


var editWorkflow = function() {
	
	_removeBlanks($attributes);
	$('#wf-wf-name').val($wf.name);
	$('#wf-wf-description').val($wf.description);
	$('#wf-wf-usecurrent').prop('checked', $wf.use_current);
	$wfmodal.dialog('option', 'title', 'Edit Workflow - ' + $wf.name);
	$wfmodal.dialog('open');
	$("#wf-attributes-list").jsGrid("render");
};


var _editStep = function(id) {
	
	// get the step
	var step = $steps[id];

	// open the dialog
	if (!step.activity.readonly) {
		if (step.activity && step.activity.source) {
			$codemirror.setValue(step.activity.source);
		}
		else {
			$codemirror.setValue('');
		}
		
		
		// set the form values
		$('#wf-step-name').val(step.label);
		$('#wf-step-timeout').val(step.timeout);
		$('#wf-step-usecurrent').prop('checked', step.use_current);
		$('#wf-step-failworkflow').prop('checked', step.failsWorkflow);
		$('#wf-step-wait').prop('checked', step.waitOnSuccess);
		$('#wf-step-requirekey').prop('checked', step.requireKey);
		
		// determine if fields need to be hidden
		if (step.waitOnSuccess) {
			$('#wf-step-requirekey-form').show();
		}
		else {
			$('#wf-step-requirekey').prop('checked', false);
			$('#wf-step-requirekey-form').hide();
		}
		
		
		$editmodal.dialog('option', 'title', 'Edit Step - ' + step.label);
		$editmodal.dialog('open');
	}
};


/**
 * get the jquery objects
 */
var _getObjects = function() {
	
	// set the objects
    $menuLoaded   = false;
    $codefield    = document.getElementById('wf-tab-code');
    $confirmmodal = $('#wf-confirm-modal');
    $okmodal      = $('#wf-ok-modal');
    $errormodal   = $('#wf-error-modal');
    $edittabs     = $('#wf-editTabs');
    $editmodal	  = $('#wf-edit-step');
    $wfmodal      = $('#wf-edit-workflow');
    $vermodal     = $('#wf-version-workflow');
    $droparea     = $('#wf-droparea');
    $toolbar      = $('#wf-toolbar');
    $header       = $('#wf-header');
    $menu         = $('#wf-menu');
    $viewport     = $('#wf-viewport');
    $workarea     = $('#wf-workarea');
    $menutoggle   = $('#wf-menuToggle');
    $iconSize     = 'small';
};


var resetPanzoom = function() {
	$workarea.panzoom('reset');
};




/**
 * position the menu in the viewport
 */
var _positionElements = function() {
    $menu.position({
        my: 'left top',
        at: 'left top',
        of: $viewport
    });
    
	$toolbar.show().position({
		my: 'center bottom',
		at: 'center bottom',
		of: $viewport
	});
	
	$droparea.show()
	.width($viewport.width() - $menu.width())
	.position({
		my: 'right bottom',
		at: 'right bottom',
		of: $viewport
	});
	
	$editmodal.dialog('option', 'position', {
		my: 'center top' + $modaltop,
		at: 'center top',
		of: $(document)
	});
	
	$wfmodal.dialog('option', 'position', {
		my: 'center top' + $modaltop,
		at: 'center top',
		of: $(document)
	});
	
	$vermodal.dialog('option', 'position', {
		my: 'center top' + $modaltop,
		at: 'center top',
		of: $(document)
	});
	$confirmmodal.dialog('option', 'position', {
		my: 'center top' + $smmodaltop,
		at: 'center top',
		of: $(document)
	});
	$errormodal.dialog('option', 'position', {
		my: 'center top' + $smmodaltop,
		at: 'center top',
		of: $(document)
	});
	$okmodal.dialog('option', 'position', {
		my: 'center top' + $smmodaltop,
		at: 'center top',
		of: $(document)
	});
};

/**
 * handle events
 */
var _onEvents = function() {
	
	// set the menu position on window resize
	$( window ).resize(function() {
		var show = ($menu.css('display') === 'none') ? false : true;
		if (show) {
			_positionElements();
		}
		else {
			$menu.show();
            _positionElements();
           $menu.hide();
		}
	});
	
	
	$('#wf-step-wait').on('change', function() {
		if ($(this).prop('checked')) {
			$('#wf-step-requirekey-form').fadeIn();
		}
		else {
			$('#wf-step-requirekey-form').fadeOut(function() {
				$('#wf-step-requirekey').prop('checked', false);
			});
			
		}
	});
	
	
	$('.new-param').on('click', function() {
		var type = $(this).attr('wfParamType');
		if (type === 'attribute') {
			$('#wf-attributes-list').jsGrid('insertItem');
		}
		else if (type === 'input') {
			$('#wf-input-list').jsGrid('insertItem');
		}
		else if (type === 'output') {
			$('#wf-output-list').jsGrid('insertItem');
		}
	});
	
	$.contextMenu({
        selector: '.connectable',
        callback: function(key, options) {
        	if (key === 'edit') {
        		_editStep(options.$trigger.attr('id'));
        	}
        	else if (key === 'delete') {
        		options.$trigger.remove();
        	}
        },
        items: {
            'edit': {
            	name: 'Edit',
            	icon: 'edit'
            },
            'delete': {
            	name: 'Delete',
            	icon: 'delete'
            }
        }
    });
	
	
	// when a node is double clicked
	$(document).on('dblclick', '.connectable', function() {
		
		// get the id
		var id   = $(this)[0].id;
		_editStep(id);
	});
};



/**
 * toggle the menu
 */
var toggleMenu = function() {

    var show = ($menu.css('display') === 'none') ? false : true;

    if (show) {
        $menu.hide('slide', {
            direction : 'left'
        }, 200);
        $menutoggle.animate({
            left : '-=' + $menu.width()
        }, 200);
        $menutoggle.removeClass('rotate180').addClass('rotate0');
    }
    else {

        $menu.show('slide', {
            direction : 'left'
        }, 200);
                        
        $menutoggle.animate({
            left : '+=' + $menu.width()
        }, 200);
        $menutoggle.removeClass('rotate0').addClass('rotate180');
    }
    
    if (!$menuLoaded) {
    	
        $("#itemSelect").accordion({
            heightStyle : "fill",
            clearStyle: true,
            autoHeight: false,
            animate: 200,
            icons: {
                header: 'ui-icon-circle-triangle-e',
                activeHeader: 'ui-icon-circle-triangle-s'
            }
        });
    }
    else {
        $menuLoaded = true;
    }
};


var _makeMenuDraggable = function() {
    $('.menuObject').draggable({
    	containment: '#wf-viewport',
    	helper: 'clone',
    	appendTo: 'body',
    	zIndex: 510,
    	revert: true,
    	revertDuration: 200
    });
};




/**
 * Helper Functions Start - http://morrisonpitt.com/farahey
 * 
 */
var _offset = function(id) {
	var el = $("#" + id)[0], _ = function(p) {
		var v = el.style[p];
		return parseInt(v.substring(0, v.length - 2), 10);
	};
	return {
		left : _("left"),
		top : _("top")
	};
};

var _setOffset = function(id, o) {
	var el = $("#" + id)[0];
	el.style.left = o.left + "px";
	el.style.top = o.top + "px";
};










/**
 * jsPlumb Styles
 * 
 */
var connectorPaintStyle = {
	lineWidth: 2,
    strokeStyle: "green",
    joinstyle: "round"
};
var connectorHoverStyle = {
    lineWidth: 4,
    strokeStyle: "#216477",
    cursor: "pointer"
};
var endpointHoverStyle = {
    fillStyle: "#216477",
    strokeStyle: "#216477"
};
var endpointPaintStyle = {
	strokeStyle: "transparent",
	fillStyle: "transparent",
	radius: 7,
	lineWidth: 0
};

var _endpointConfig = function(type) {
	
	var color;
	
	if (type === 'success') {
		color = 'green';
	}
	else if (type === 'fail') {
		color = 'red';
	}
	else if (type === 'exception') {
		color = 'red';
	}
	
	// build a standard config
	var cfg = {
		endpoint: "Dot",
		paintStyle: endpointPaintStyle,
		isSource: true,
		connector: [ "Flowchart", { stub: [30, 30], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ],
		connectorStyle: {
			lineWidth: 2,
			strokeStyle: color,
			joinstyle: "round"
		},
		hoverPaintStyle: {
			fillStyle: color
		},
		connectorHoverStyle: {
			fillStyle: color
		},
		dragOptions: {},
		connectorOverlays: [
		    [ "Arrow", { width : 8, length : 8, location : 1 } ]
	    ]
	};
	
	if (type === 'exception') {
		cfg.connectorStyle.dashstyle = "2";
	}
	
	// return the configuration
	return cfg;
};

var targetEndpoint = {
	endpoint: "Dot",
	paintStyle: { fillStyle: 'transparent', radius: 7},
	hoverPaintStyle: {fillStyle: 'transparent'},
	maxConnections: -1,
	dropOptions: { hoverClass: "hover", activeClass: "active" },
	isTarget: true
};








/**
 * Adds end points to the step
 * 
 */
var _addEndpoints = function (toId, e) {
	
	if (e.success) {
        var successUUID = toId + e.success;
        $diagram.addEndpoint(toId, _endpointConfig('success'), {
            anchor: e.success,
            uuid: successUUID
        });
	}
	if (e.fail) {
        var failUUID = toId + e.fail;
        $diagram.addEndpoint(toId, _endpointConfig('fail'), {
        	anchor: e.fail,
        	uuid: failUUID
        });
	}
	if (e.exception) {
        var exceptUUID = toId + e.exception;
        $diagram.addEndpoint(toId, _endpointConfig('exception'), {
        	anchor: e.exception,
        	uuid: exceptUUID
        });
	}
	if (e.target) {
        var targetUUID = toId + e.target;
        $diagram.addEndpoint(toId, targetEndpoint, {
        	anchor: e.target,
        	uuid: targetUUID
        });
	}
};







/**
 * Updates the magnetization of a step
 * 
 */
var _updateMagnets = function(elements, container) {

	var _dragElement = null;
	
	// create a new magnetizer
	var magnet = new Magnetizer({
		container : container,
		getContainerPosition : function(c) {
			return c.offset();
		},
		getPosition : _offset,
		getSize : function(id) {
			return [ $("#" + id).outerWidth(), $("#" + id).outerHeight() ];
		},
		getId : function(id) {
			return id;
		},
		setPosition : _setOffset,
		elements : elements,
		continuous: true,
		filter : function(id) {
			return id !== _dragElement;
		},
		padding : [ 5, 5 ]
	});

	// set the elements to draggable
	$diagram.draggable(elements, {
		start : function(p) {
			_dragElement = p.el.getAttribute("id");
		},
		drag : function(p) {
			magnet.executeAtEvent(p.e);
			$diagram.repaintEverything();
		},
		stop : function(p) {
			_dragElement = null;
		}
	});
};












/**
 * add a new step to the workflow
 * 
 */
var _addStep = function(step, prev, position, size) {
	
	// set up new variables
	var itemClass, endpoint, posObj, posLbl, end, $newObj;
	
	// initialize a new id and size
	var newId      = 'item_' + (new Date()).getTime();
	var sizeClass  = 'item-md';
	var itemHeight = 75;
	
	// set the size class if specified
	if (size === 'small') {
		sizeClass = 'item-sm';
		itemHeight = 35;
	}
	else if (size === 'large') {
		sizeClass = 'item-lg';
		itemHeight = 100;
	}
	
	// if a position was passed
	if (position) {
		
		// create a using function to offset the element to the offset
		posObj = {
			using: function(pos, fb) {
				$(this).offset(position);
			},
			of: $workarea
		};
	}
	else {
		
		// if there is no previous set the previous to the workarea
		// and offset from the top left by 20px in each direction
		if (!prev) {
			prev = $workarea;
			posObj = {
				using: function(pos, fb) {
					$(this).css('top', (fb.target.height / 2) + 20);
					$(this).css('left', (fb.target.width / 2) + 20);
				}
			};
		}
		
		// otherwise set it 150px to the right of the previous element
		else {
			posObj = {
				my: 'center',
				at: 'right+150'
			};
		}
	}
	
	// set the label position
	posLbl = {
		my : 'top+5',
		at : 'bottom'
	};
	
	// look at the activity type and add the appropriate endpoints
	// an styles
	if (step.activity.type === 'start') {
		endpoint = {
			success: $conn.success
				};
	}
	else if (step.activity.type === 'end') {
		endpoint = {
			target: $conn.target
		};
	}
	else {
		endpoint = {
			success: $conn.success,
			fail: $conn.fail,
			exception: $conn.exception,
			target: $conn.target
		};
	}
	
	// create an item class
	itemClass = sizeClass + ' item ' + step.activity.type + 'Item';

	
	// create the html for the step
	var stepHTML = 	'<div id="' + newId +
					'" wfItemLabel="' + step.label +
					'" wfItemType="' + step.activity.type +
					'" wfItemId="' + step.id +
					'" wfActivity="' + step.activity.id +
					'" class="' + sizeClass + ' connectable magnetized">' +
					'    <div class="' + itemClass + '"></div>' +
					'    <div id="itemlabel-' + newId + '" class="itemLabel">' +
					'        <span>' + step.label + '</span>' +
					'    </div>' +
					'</div>';
	
	// add the divs
	$workarea.append(stepHTML);
	
	// if no position was specified set the relative position to the previous
	if (!position) {
		posObj.of = prev;
	}
	
	// get the jquery object and position it
	$newObj   = $('#' + newId);
	posLbl.of = $newObj;
	$newObj.position(posObj);
	
	// set the label width and position it
	$('#itemlabel-' + newId).width($('#itemlabel-' + newId + ' > span').outerWidth() + 4);
	$('#itemlabel-' + newId).position(posLbl);

	// add the endpoints and push the new id to the steps array
	_addEndpoints(newId, endpoint);
	$steps[newId] = step;
	$elements.push(newId);
	_updateMagnets($elements, $workarea);

	// return the created object
	return $newObj;
};












/**
 * set up the workarea and viewport and add the initial nodes
 * 
 */
var _addNodes = function(data, size) {

	var prevElement;
	
	// set the title
	$header.html(data.name);
	
	// create the step divs and get the start/end ids
	$.each(data.steps, function(index, step) {
		prevElement = _addStep(step, prevElement, null, size);
		data.steps[index].htmlId = prevElement.attr('id');
	});
};

/**
 * function to find the html id of a step
 */
var _findStep = function(id, data) {
	for (var i = 0; i < data.steps.length; i++) {
		if (data.steps[i].id === id) {
			return data.steps[i].htmlId;
		}
	}
	return null;
};


/**
 * connect the nodes
 */
var _connectNodes = function(data) {
	$.each(data.steps, function(index, step) {

		// connect success
		if (step.success && step.success !== step.id) {
			$diagram.connect({
				uuids:[
				    step.htmlId + $conn.success,
				    _findStep(step.success, data) + $conn.target
				]
			});
		}
		
		// connect fail
		if (step.fail && step.fail !== step.id) {
			$diagram.connect({
				uuids:[
				    step.htmlId + $conn.fail,
				    _findStep(step.fail, data) + $conn.target
				]
			});
		}
		
		// connect left
		if (step.exception && step.exception !== step.id) {
			$diagram.connect({
				uuids:[
				    step.htmlId + $conn.exception,
				    _findStep(step.exception, data) + $conn.target
				]
			});
		}
	});
};


/**
 * creates a new item
 */
var _newItem = function(path, body, step) {
	
	var msg;
	
	var id       = step.attr('id');

	
	if (body.type === 'task') {
		
		if (body.activity === 'task') {
			console.log('new task');
		}
		else {
			msg = {
				label: body.label,
				activity: body.activity,
				workflow: body.workflow
			};
		}
	}
	
	
	
	if (msg) {
        $.ajax({
            url : path + '?maxdepth=0',
            method : 'POST',
            crossDomain : true,
            headers : {
                'Accept' : 'application/json'
            },
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(msg)
        })
        .done(function(data, status, xhr) {
        	step.attr('wfItemId', data.id);
        	$steps[id] = data;
        })
        .fail(function(xhr, status, err) {
        	console.log('failed', xhr, status, err);
        	step.remove();
        });
	}
	else {
		step.remove();
	}
};


var _ioParameters = function() {
	return [
	    {
	    	name: 'name',
	    	title: 'Name',
	    	type: 'text'
	    },
	    {
	    	name: 'type',
	    	title: 'Type',
	    	type: 'text'
	    },
	    {
	    	name: 'mapAttribute',
	    	title: 'Bind Attribute',
	    	type: 'select',
	    	valueField: 'id',
	    	textField: 'name',
	    	items: [{id: '', name: 'None'}].concat($.pluck($attributes, ['id', 'name']))
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




/**
 * initialize the canvas and set up the panzoom
 */
var _initCanvas = function() {
		
	// create the edit dialog
	$editmodal.dialog({
		autoOpen: false,
		height: $editheight,
		width: $editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		},
		buttons: [
		    {
		    	text: 'OK',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		    {
		    	text: 'Apply',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		    {
		    	text: 'Cancel',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		]
	});
	
	
	// create the edit dialog
	$vermodal.dialog({
		autoOpen: false,
		height: $editheight,
		width: $editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		},
		buttons: [
		    {
		    	text: 'OK',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		    {
		    	text: 'Cancel',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		]
	});
	
	// create the edit dialog
	$wfmodal.dialog({
		autoOpen: false,
		height: $editheight,
		width: $editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		},
		buttons: [
		    {
		    	text: 'OK',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		    {
		    	text: 'Apply',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		    {
		    	text: 'Cancel',
		    	click: function() {
					$( this ).dialog( "close" );
				}
		    },
		]
	});
	
	
	// create the edit dialog
	$confirmmodal.dialog({
		autoOpen: false,
		height: $okheight,
		width: $okwidth,
		modal: true,
		draggable: false,
		closeText: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	
	
	// create the edit dialog
	$okmodal.dialog({
		autoOpen: false,
		height: $okheight,
		width: $okwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	
	// create the edit dialog
	$errormodal.dialog({
		autoOpen: false,
		height: $okheight,
		width: $okwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	
	
	// create the tabs
	$edittabs.tabs({
        activate: function(event, ui) {
        	if (ui.newPanel.attr('id') === 'wf-tab-input') {
            	_removeBlanks($inputs);
            	$("#wf-input-list").jsGrid("render");
            }
            else if (ui.newPanel.attr('id') === 'wf-tab-output') {
            	_removeBlanks($outputs);
            	$("#wf-output-list").jsGrid("render");
            }
            else if (ui.newPanel.attr('id') === 'wf-tab-source') {
            	$codemirror.refresh();
            }
            
            $activetab = $edittabs.tabs("option","active");
        },
        active: $edittabs.tabs({
        	active: $activetab
        })
	});
	
	
	$codemirror = CodeMirror.fromTextArea($codefield, {
	    gutters: ["note-gutter", "CodeMirror-linenumbers"],
	    lineNumbers: true,
	    mode: 'javascript'
	});
	
	// add tool tips
	$("body").tooltip({
		selector: '[data-toggle=tooltip]',
		position: {
			my: "left+15 center",
			at: "right center"
		},
		show: {
			delay: 500
		}
	});
	
	$("#wf-attributes-list").jsGrid({
	    width: "100%",
	    height: "250px",
	    editing: true,
	    autoload: true,
	    data: $attributes,
	    onItemUpdated: function(update) {
	    	$("#wf-input-list").jsGrid('option', 'fields', _ioParameters());
	    	$("#wf-output-list").jsGrid('option', 'fields', _ioParameters());
	    },
	    onItemInserted: function(insert) {
	    	$("#wf-attributes-list").jsGrid('editItem', insert.item);
	    	console.log($attributes);
	    },
	    fields: [
	        { name: 'name', title: 'Name', type: 'text' },
	        { name: 'type', title: 'Type', type: 'text' },
	        { name: 'defaultValue', title: 'Default', type: 'text' },
	        { name: 'description', title: 'Description', type: 'text' },
	        { type: 'control' }
	    ]
	});
	
	$("#wf-input-list").jsGrid({
	    width: "100%",
	    height: "395px",
	    editing: true,
	    autoload: true,
	    data: $inputs,
	    onItemInserted: function(insert) {
	    	$("#wf-input-list").jsGrid('editItem', insert.item);
	    },
	    fields: _ioParameters()
	});
	
	
	$("#wf-output-list").jsGrid({
	    width: "100%",
	    height: "395px",
	    editing: true,
	    autoload: true,
	    data: $outputs,
	    onItemInserted: function(insert) {
	    	$("#wf-output-list").jsGrid('editItem', insert.item);
	    },
	    fields: _ioParameters()
	});
	
	/**
	 * bind the jsPlumb events
	 */
	
	// before a new connection is made
    $diagram.bind('beforeDrop', function(info) {
        return info.sourceId !== info.targetId;
    });
    
    // when a new connection is made
    $diagram.bind('connection', function(info, event) {
    	
    	// get the connection type
    	var type = info.sourceEndpoint.anchor.type;
    	var source = info.source.id;
    	var target = info.target.id;
    	
    	// connect the appropriate
    	if (type === $conn.success) {
    		$steps[source].success = $steps[target].id;
    	}
    	else if (type === $conn.fail) {
    		$steps[source].fail = $steps[target].id;
    	}
    	else if (type === $conn.exception) {
    		$steps[source].exception = $steps[target].id;
    	}
    });
    
    // when a connection is removed
    $diagram.bind('connectionDetached', function(info, event) {
    	
    	// get the connection type
    	var type = info.sourceEndpoint.anchor.type;
    	var source = info.source.id;
    	var target = info.target.id;
    	
    	// connect the appropriate
    	if (type === $conn.success) {
    		$steps[source].success = null;
    	}
    	else if (type === $conn.fail) {
    		$steps[source].fail = null;
    	}
    	else if (type === $conn.exception) {
    		$steps[source].exception = null;
    	}
    });
    
    
    
    
    
    
	
    $droparea.droppable({
        drop: function(e, ui) {
        	
        	// remove the helper
        	ui.helper.remove();
        	
        	// create the step
        	var step = {
                id: ui.draggable.attr('wfItemId'),
                label: ui.draggable.attr('wfItemLabel'),
                activity: {
                    type: ui.draggable.attr('wfItemType')
                }
            };
        	
        	// add the step to the workspace
            var uiStep = _addStep(step, null, ui.offset, $iconSize);
            
            // create the step
            _newItem($wfpath + '/steps', {
            	activity: ui.draggable.attr('wfActivity'),
            	label: step.label,
            	workflow: $wf.id,
            	type: step.activity.type
            }, uiStep);
        }
    });
    
	// set up panzoom with firefox compatibility
	$panzoom = $workarea.panzoom();

	// set up the scroll zoom
	$panzoom.parent().on('mousewheel.focal DOMMouseScroll', function(e) {

		// require the shift key to scroll so that normal page scroll can take place
		if (e.shiftKey) {
			
			// calculate the offset
			e.preventDefault();
			
			// for firefox set the wheel delta to negative
			var ffWheel = e.originalEvent.detail * -1;
			
			// determine the delta
			var delta = e.delta || e.originalEvent.wheelDelta || ffWheel;
			var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
			var dc = document.getElementById($workarea.attr('id'));
			var offsetX = Math.abs(dc.offsetLeft) + e.originalEvent.clientX;
			var offsetY = Math.abs(dc.offsetTop) + e.originalEvent.clientY;

			// set the focal point
			var focal = {
				clientX : offsetX,
				clientY : offsetY
			};

			// zoom in on the focal point
			$panzoom.panzoom('zoom', zoomOut, {
				increment : 0.1,
				animate : false,
				silent : false,
				focal : focal
			});
		}
	});
};



/**
 * position the workarea
 */
var _positionWorkarea = function() {

	
	// reposition the work area
	$workarea.position({
		using: function(pos, fb) {
			$(this).css('top', -(fb.element.height / 2 ));
			$(this).css('left', -(fb.element.width / 2 ));
		},
		of : $viewport
	});
	
	// add the menu toggle
	$menutoggle.position({
		my : 'left center',
		at : 'left center',
		of : $viewport
	});
};



/**
 * load the workflow
 * 
 */
var _loadWorkflow = function(id) {
	
    // get the workflow
    $.ajax({
        url : $wfpath + '/workflows/' + id,
        method : 'GET',
        crossDomain : true,
        headers : {
            Accept : 'application/json'
        }
    })
    .done(function(data, status, xhr) {
        console.log(data, xhr, status);
        
        // split up the parameters
        $.each(data.parameters, function(idx, val) {
        	if (val.scope === 'attribute') {
        		$attributes.push(val);
        	}
        	else if (val.scope === 'input') {
        		$inputs.push(val);
        	}
        	else if (val.scope === 'output') {
        		$outputs.push(val);
        	}
        });
        
        // wait for jsPlumb to be ready
        $diagram.ready(function() {
        	$wf = data;
            _addNodes(data, $iconSize);
            _connectNodes(data);
            _initCanvas();
        });
    })
    .fail(function(xhr, status, err) {
        console.log('FAIL', err);
    })
    .always(function() {
    	_positionElements();
    });
};


/**
 * add new node html to menu
 */
var _menuNode = function(node) {
	return 	'<li class="itemList">' +
			'<div class="menuObject" ' +
			'wfItemLabel="' + node.name + '" ' +
			'wfItemType="' + node.type + '" ' +
			'wfActivity="' + node.id + '" ' +
			'wfItemId="">' +
			'<div class="centered item-sm ' + node.type + 'Item"></div>' +
			'<div class="itemListLabel">' + node.name + '</div>' +
			'</div>' +
			'</li>';
};


/**
 * load menu items
 */
var _loadMenuItems = function() {
	
	// condition
	$('#generalObjects').append(_menuNode({
		id: 'condition',
		name: 'Condition',
		type: 'condition'
	}));
	
	// loop
	$('#generalObjects').append(_menuNode({
		id: 'loop',
		name: 'Loop',
		type: 'loop'
	}));
	
	// new task
	$('#generalObjects').append(_menuNode({
		id: 'task',
		name: 'Task',
		type: 'task'
	}));

    // get the activities
    $.ajax({
        url : $wfpath + '/activitys?maxdepth=0',
        method : 'GET',
        crossDomain : true,
        headers : {
            Accept : 'application/json'
        }
    })
    .done(function(data, status, xhr) {
        $activities = data;
        
        for (var i = 0; i < $activities.length; i++) {
            var a = $activities[i];
            if (a.type === 'end') {
            	$('#generalObjects').append(_menuNode(a));
            }
            else if (a.type === 'task') {
            	$('#taskObjects').append(_menuNode(a));
            }
        }
        
        
        // get the workflows
        $.ajax({
            url : $wfpath + '/workflows?maxdepth=0',
            method : 'GET',
            crossDomain : true,
            headers : {
                Accept : 'application/json'
            }
        })
        .done(function(data, status, xhr) {
            $workflows = data;
            
            for (var i = 0; i < $workflows.length; i++) {
                var w = $workflows[i];
            	$('#workflowObjects').append(_menuNode({
            		id: w.id,
            		name: w.name,
            		type: 'workflow'
            	}));
            }
            
            // make the menu items draggable
            _makeMenuDraggable();
            
        })
        .fail(function(xhr, status, err) {
            console.log('ERROR', err);
        });
    })
    .fail(function(xhr, status, err) {
        console.log('ERROR', err);
    });
};




/**
 * call the initialization functions
 */
$(document).ready(function() {

	// allow html in dialog headers
	$.widget('ui.dialog', $.extend({}, $.ui.dialog.prototype, {
	    _title: function(titleBar) {
	        titleBar.html(this.options.title || '&#160;');
	    }
	}));
	
	// get the id
	var id = getURLParameter('id');
	
	// if there was an id, try to init the canvas
	if (id) {
	    _getObjects();
	    _onEvents();
	    _positionWorkarea();
	    _loadWorkflow(id);
	    _loadMenuItems();
	}
});



