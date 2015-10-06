var elements = [];


/* Start - http://morrisonpitt.com/farahey */
var _offset = function(id) {
	var el = $("#" + id)[0], _ = function(p) {
		var v = el.style[p];
		return parseInt(v.substring(0, v.length - 2));
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



// add the nodes to the canvas container
var _addNodes = function(canvas, container, header, data, size) {
	
	var sizeClass  = 'item-md';
	var itemHeight = 75;
	
	if (size === 'small') {
		sizeClass = 'item-sm';
		itemHeight = 35;
	}
	else if (size === 'large') {
		sizeClass = 'item-lg';
		itemHeight = 100;
	}
	
	
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
	
	
	

	
	
	
	var ch = $('#' + canvas).height();
	
	// set the title
	$('#' + header).html(data.name);

	$('#' + container).position({
		my : 'center center',
		at : 'left top',
		of : $('#' + canvas)
	});
	
	$('#wf-menu').position({
		my : 'left top',
		at : 'left top',
		of : $('#wf-viewport')
	});

	$('#wf-menuToggle').position({
		my : 'left center',
		at : 'left center',
		of : $('#wf-viewport')
	});
	$('#wf-menuToggle').show();
	
	var prevElement, my, at, start, end;

	// create the step divs and get the start/end ids
	$.each(data.steps, function(index, step) {

		if (!prevElement) {
			prevElement = $('#' + container);
			my = 'left+20 top+20';// + (ch - (itemHeight + 20));
			at = 'center';
		} else {
			my = 'center';
			at = 'right+150';
		}

		var itemClass, endpoint;
		endpoint = {
			success: 'Right',
			fail: 'Bottom',
			exception: 'Top',
			target: 'Left'
		};

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

		// add the divs
		$('#' + container).append(
				'<div id="' + step.id + '" class="' + sizeClass + ' connectable magnetized"><div class="'
						+ itemClass + '"></div><div id="itemlabel-' + step.id + '" class="itemLabel"><span id="itemspan-' + step.id + '">'
						+ step.label + '</span></div></div>');
		$('#' + step.id).position({
			my : my,
			at : at,
			of : prevElement
		});

		$('#itemlabel-' + step.id).width($('#itemspan-' + step.id).outerWidth() + 4);
		$('#itemlabel-' + step.id).position({
			my : 'top+5',
			at : 'bottom',
			of : $('#' + step.id)
		});
		prevElement = $('#' + step.id);

		_addEndpoints(step.id, endpoint);
		elements.push(step.id);
	});
};











// initialize the pan and zoom
var _initCanvas = function(container) {

	// returns the position
	var gridFree = function(container) {
		return function(id, current, delta) {

			return {
				left : delta.left,
				top : delta.top
			};
		};
	};

	var _dragElement = null, _dragFilter = function(id) {
		return id != _dragElement;
	};
	
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
		filter : _dragFilter,
		padding : [ 5, 5 ],
		constrain : gridFree($('#' + container))
	});

	jsPlumb.repaintEverything();

	
	jsPlumb.draggable(elements, {
		start : function(p) {
			_dragElement = p.el.getAttribute("id");
		},
		drag : function(p) {
			magnet.executeAtEvent(p.e);
			// here it might be the case that farahey should fire individual
			// move events, because with lots of nodes
			// maybe repainting everything is wasteful.
			jsPlumb.repaintEverything();
		},
		stop : function(p) {
			_dragElement = null;
		}
	});


	
	// set up panzoom with firefox compatibility
	$panzoom = $('#' + container).panzoom({
		cursor: 'all-scroll'
	});
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