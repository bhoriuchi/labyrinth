var elements = [];






/* Start - http://morrisonpitt.com/farahey/ */
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

/* End - http://morrisonpitt.com/farahey/ */









// add the nodes to the canvas container
var _addNodes = function(canvas, container, header, data) {

	// set the title
	$('#' + header).html(data.name);

	$('#' + container).position({
		my : 'center',
		at : 'center',
		of : $('#' + canvas)
	});

	var prevElement, my, at, start, end;

	// create the step divs and get the start/end ids
	$.each(data.steps, function(index, step) {

		if (!prevElement) {

			var cw = $('#' + canvas).width();

			prevElement = $('#' + container);
			my = 'left-' + (cw / 2) + ' center-230';
			at = 'center';
		} else {
			my = 'center';
			at = 'right+150';
		}

		var itemClass;

		if (step.activity.type === 'start') {
			itemClass = 'item startItem';
		}
		else if (step.activity.type === 'end') {
			itemClass = 'item endItem';
			end = step.id;
		}
		else if (step.activity.type === 'task') {
			itemClass = 'item taskItem';
		}
		else if (step.activity.type === 'condition') {
			itemClass = 'item conditionItem';
		}
		else if (step.activity.type === 'loop') {
			itemClass = 'item loopItem';
		}
		else if (step.activity.type === 'workflow') {
			itemClass = 'item workflowItem';
		}
		else {
			itemClass = 'item';
		}

		// add the divs
		$('#' + container).append(
				'<div id="' + step.id + '" class="connectable"><div class="'
						+ itemClass + '"></div><div class="itemLabel">'
						+ step.label + '</div></div>');
		$('#' + step.id).position({
			my : my,
			at : at,
			of : prevElement
		});

		prevElement = $('#' + step.id);

		elements.push(step.id);
	});
	
	var common = {
			connector : [ "Flowchart" ],
			anchor : [ "Left", "Right" ],
			endpoint : [ "Dot", {
				radius : 3
			} ]
	};
	
	// plumb everything
	$.each(data.steps, function(index, step) {

		var success = step.success ? step.success : end;
		var fail = step.fail ? step.fail : end;
		var except = step.exception ? step.exception : end;

		if (success !== step.id) {
			jsPlumb.connect({
				source : step.id,
				target : success,
				anchor : "Right",
				overlays : [ [ "Arrow", {
					width : 12,
					length : 12,
					location : 0.67
				} ] ]
			}, common);
		}
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
	$panzoom = $('#' + container).panzoom();
	$panzoom.parent().on('mousewheel.focal DOMMouseScroll', function(e) {

		// require the shift key to scroll so that normal page scroll can take place
		if (e.shiftKey) {
			
			// calculate the offset
			e.preventDefault();
			
			// for firefox set the wheel delta to negative
			var ffWheel = e.originalEvent.detail * -1;
			
			// determine teh delta
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