



/**
 * variables used through out
 */
var $steps = [];
var $menuLoaded, $activities, $workflows;
var $panzoom, $workarea, $viewport, $menu, $menuToggle, $iconSize;

/**
 * gets url path param - http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
 */
var getURLParameter = function(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(document.location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};


/**
 * get the jquery objects
 */
var _getObjects = function() {
	
	// set the objects
    $menuLoaded = false;
    $menu       = $('#wf-menu');
    $viewport   = $('#wf-viewport');
    $workarea   = $('#wf-workarea');
    $menuToggle = $('#wf-menuToggle');
    $iconSize   = 'small';
};


/**
 * handle events
 */
var _onEvents = function() {
	
	// set the menu position on window resize
	$( window ).resize(function() {
		var show = ($menu.css('display') === 'none') ? false : true;
		if (show) {
			$menu.position({
				my: 'left top',
				at: 'left top',
				of: $viewport
			});
		}
		else {
			$menu.show();
            $menu.position({
                my: 'left top',
                at: 'left top',
                of: $viewport
            });
           $menu.hide();
		}
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
        $menuToggle.animate({
            left : '-=' + $menu.width()
        }, 200);
        $menuToggle.removeClass('rotate180')
                .addClass('rotate0');
    } else {

        $menu.show('slide', {
            direction : 'left'
        }, 200);
                        
        $menuToggle.animate({
            left : '+=' + $menu.width()
        }, 200);
        $menuToggle.removeClass('rotate0')
                .addClass('rotate180');
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
    } else {
        $menuLoaded = true;
    }
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
    },
    connectorHoverStyle = {
    	lineWidth: 4,
    	strokeStyle: "#216477",
    	cursor: "pointer"
    },
    endpointHoverStyle = {
    	fillStyle: "#216477",
    	strokeStyle: "#216477"
    },
    successEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "transparent",
                fillStyle: "transparent",
                radius: 7,
                lineWidth: 0
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [30, 30], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: {
            	lineWidth: 2,
            	strokeStyle: "green",
            	joinstyle: "round"
            },
            hoverPaintStyle: {
            	fillStyle: "green"
            },
            connectorHoverStyle: {
            	fillStyle: "green"
            },
            dragOptions: {},
            connectorOverlays: [
                [ "Arrow", { width : 8, length : 8, location : 1 } ]
            ]

    },
    failEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "transparent",
                fillStyle: "transparent",
                radius: 7,
                lineWidth: 0
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [30, 30], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: {
            	lineWidth: 2,
            	strokeStyle: "red",
            	joinstyle: "round"
            },
            hoverPaintStyle: {
            	fillStyle: "red"
            },
            connectorHoverStyle: {
            	fillStyle: "red"
            },
            dragOptions: {},
            connectorOverlays: [
                [ "Arrow", { width : 8, length : 8, location : 1 } ]
            ]

    },
    exceptionEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "transparent",
                fillStyle: "transparent",
                radius: 7,
                lineWidth: 2
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [30, 30], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: {
            	lineWidth: 2,
            	strokeStyle: "red",
            	joinstyle: "round",
            	dashstyle: "2"
            },
            hoverPaintStyle: {
            	strokeStyle: "red"
            },
            connectorHoverStyle: {
            	fillStyle: "red"
            },
            dragOptions: {},
            connectorOverlays: [
                [ "Arrow", { width : 8, length : 8, location : 1 } ]
            ]
    },
    targetEndpoint = {
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
        jsPlumb.addEndpoint(toId, successEndpoint, {
            anchor: e.success, uuid: successUUID
        });
	}
	if (e.fail) {
        var failUUID = toId + e.fail;
        jsPlumb.addEndpoint(toId, failEndpoint, {
        	anchor: e.fail, uuid: failUUID
        });
	}
	if (e.exception) {
        var exceptUUID = toId + e.exception;
        jsPlumb.addEndpoint(toId, exceptionEndpoint, {
        	anchor: e.exception, uuid: exceptUUID
        });
	}
	if (e.target) {
        var targetUUID = toId + e.target;
        jsPlumb.addEndpoint(toId, targetEndpoint, {
        	anchor: e.target, uuid: targetUUID
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
		container : $('#' + container),
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
	jsPlumb.draggable(elements, {
		start : function(p) {
			_dragElement = p.el.getAttribute("id");
		},
		drag : function(p) {
			magnet.executeAtEvent(p.e);
			jsPlumb.repaintEverything();
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
	
	// create a standard endpoint definition
	endpoint = {
		success: 'Right',
		fail: 'Bottom',
		exception: 'Top',
		target: 'Left'
	};

	// look at the activity type and add the appropriate endpoints
	// an styles
	if (step.activity.type === 'start') {
		itemClass = sizeClass + ' item startItem';
		endpoint = { success: 'Right' };
	}
	else if (step.activity.type === 'end') {
		itemClass = sizeClass + ' item endItem';
		end = step.id;
		endpoint = { target: 'Left' };
	}
	else if (step.activity.type === 'task') {
		itemClass = sizeClass + ' item taskItem';
	}
	else if (step.activity.type === 'condition') {
		itemClass = sizeClass + ' item conditionItem';
	}
	else if (step.activity.type === 'loop') {
		itemClass = sizeClass + ' item loopItem';
	}
	else if (step.activity.type === 'workflow') {
		itemClass = sizeClass + ' item workflowItem';
	}
	else {
		itemClass = sizeClass + ' item';
	}

	
	// create the html for the step
	var stepHTML = 	'<div id="' + newId +
					'" wfItemLabel="' + step.label +
					'" wfItemType="' + step.activity.type +
					'" wfItemId="' + step.id +
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
	$steps.push(newId);
	_updateMagnets($steps, 'wf-workarea');
	return $('#' + newId);
};












/**
 * set up the workarea and viewport and add the initial nodes
 * 
 */
var _addNodes = function(canvas, container, header, data, size) {

	var prevElement, my, at, start, end;
	var posObj = {};
	
	// set the title
	$('#' + header).html(data.name);
	
	// create the step divs and get the start/end ids
	$.each(data.steps, function(index, step) {
		prevElement = _addStep(step, prevElement, null, size);
	});
};














/**
 * initialize the canvas and set up the panzoom
 */
var _initCanvas = function(container) {
	
    $viewport.droppable({
        drop: function(e, ui) {
            
            var obj = {
                id: ui.draggable.attr('wfItemId'),
                label: ui.draggable.attr('wfItemLabel'),
                activity: {
                    type: ui.draggable.attr('wfItemType')
                }
            };
            _addStep(obj, null, ui.offset, $iconSize);
        }
    });
	
	
	// set up panzoom with firefox compatibility
	$panzoom = $('#' + container).panzoom();
	
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
			var dc = document.getElementById(container);
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
				silent : true,
				focal : focal
			});
		}
	});
};



/**
 * position the workarea
 */
var _positionWorkarea = function() {
	// position the at the top left of the viewport
	$('#wf-menu').position({
		my : 'left top',
		at : 'left top',
		of : $('#wf-viewport')
	});

	// add the menu toggle
	$('#wf-menuToggle').position({
		my : 'left center',
		at : 'left center',
		of : $('#wf-viewport')
	});
	
	// reposition the work area
	$workarea.position({
		using: function(pos, fb) {
			$(this).css('top', -(fb.element.height / 2 ));
			$(this).css('left', -(fb.element.width / 2 ));
		},
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
        url : '/api/wf/workflows/' + id,
        method : 'GET',
        crossDomain : true,
        headers : {
            Accept : 'application/json'
        }
    })
    .done(function(data, status, xhr) {
        console.log(data, xhr, status);
        
        jsPlumb.ready(function() {

            if (xhr.status === 200) {
                // jsplumb everything
                _addNodes('wf-viewport', 'wf-workarea', 'wf-header', data, $iconSize);
            }
            else {
            	console.log(status);
            }
           
            _initCanvas('wf-workarea');
            jsPlumb.bind('beforeDrop', function(params) {
                return params.sourceId !== params.targetId;
            });
        });
    })
    .fail(function(xhr, status, err) {
        console.log('ERROR', err);
    });
};



/**
 * load menu items
 */
var _loadMenuItems = function() {
	
    // get the activities
    $.ajax({
        url : '/api/wf/activitys?maxdepth=0',
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
            if (a.type === 'end' || a.id === 'activity-log') {
                $('#generalObjects').append('<li class="itemList"><div class="menuObject" wfItemLabel="' + a.name + '" wfItemType="' + a.type + '" wfItemId="' + a.id + '"><div class="centered item-sm ' + a.type + 'Item"></div><div class="itemListLabel">' + a.name + '</div></div></li>');
            }
            if (a.type === 'task') {
                $('#taskObjects').append('<li class="itemList"><div class="menuObject" wfItemLabel="' + a.name + '" wfItemType="' + a.type + '" wfItemId="' + a.id + '"><div class="centered item-sm ' + a.type + 'Item"></div><div class="itemListLabel">' + a.name + '</div></div></li>');
            }
        }
        $('#generalObjects').append('<li class="itemList"><div class="menuObject" wfItemLabel="Condition" wfItemType="condition" wfItemId="condition"><div class="centered item-sm conditionItem"></div><div class="itemListLabel">Condition</div></div></li>');
        $('#generalObjects').append('<li class="itemList"><div class="menuObject" wfItemLabel="Loop" wfItemType="loop" wfItemId="loop"><div class="centered item-sm loopItem"></div><div class="itemListLabel">Loop</div></div></li>');
        
        
        // get the workflows
        $.ajax({
            url : '/api/wf/workflows?maxdepth=0',
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
                $('#workflowObjects').append('<li class="itemList"><div class="menuObject" wfItemLabel="' + w.name + '" wfItemType="workflow" wfItemId="' + w.id + '"><div class="centered item-sm workflowItem"></div><div class="itemListLabel">' + w.name + '</div></div></li>');
                
            }
            
            $('.menuObject').draggable({helper: 'clone', appendTo: '#wf-workarea', zIndex: 65100, containment:'#wf-viewport'});
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



