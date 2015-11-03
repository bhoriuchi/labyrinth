/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(
	[
	 	'jquery',
        'wf-global',
        'wf-util',
        'wf-edit',
        'jsplumb',
        'farahey',
    	'vendor/cm/lib/codemirror',
    	'vendor/cm/mode/javascript/javascript',
    ],
function($, $g, $util, $edit, jsPlumb, Magnetizer, CodeMirror) {
	

	
	
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

	var endpointConfig = function(type) {
		
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
			connector: [ "Flowchart", { stub: [30, 30], gap: [5, 5], cornerRadius: 5, alwaysRespectStubs: true} ],
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
	 * Updates the magnetization of a step
	 * 
	 */
	var updateMagnets = function(elements, container) {

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
		$g.diagram.draggable(elements, {
			start : function(p) {
				_dragElement = p.el.getAttribute("id");
			},
			drag : function(p) {
				magnet.executeAtEvent(p.e);
				$g.diagram.repaintEverything();
			},
			stop : function(p) {
				_dragElement = null;
				$g.diagram.repaintEverything();
			}
		});
	};
	
	
	var init = function() {
		
		var si = 0;
		
		// create the tabs
		$g.editTabs.tabs({
	        activate: function(event, ui) {
	        	
	        	if (ui.newPanel.attr('id') === 'wf-tab-input') {
	            	$util.removeBlanks($g.inputs);
	            	$("#wf-input-list").jsGrid("render");
	            }
	            else if (ui.newPanel.attr('id') === 'wf-tab-output') {
	            	$util.removeBlanks($g.outputs);
	            	$("#wf-output-list").jsGrid("render");
	            }
	            else if (ui.newPanel.attr('id') === 'wf-tab-source') {
	            	$g.codemirror.refresh();
	            }
	            
	            $g.activetab = $g.editTabs.tabs("option","active");
	            
	        	if (localStorage) {
	        		localStorage.setItem($g.lsTab, $g.activetab);
	        	}
	            
	        },
	        active: $g.editTabs.tabs({
	        	active: localStorage ? localStorage.getItem($g.lsTab) : $g.activetab
	        })
		});
		
		
		$g.codemirror = CodeMirror.fromTextArea($g.codefield, {
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
		
		// set string as the default data type
		$.each($.pluck($g.dataTypes, ['id', 'name']), function(idx, item) {
			if (item.name === 'string') {
				si = idx;
			}
		});
		
		$("#wf-attributes-list").jsGrid({
		    width: "100%",
		    height: "250px",
		    editing: true,
		    rowClick: function() {return false;},
		    autoload: true,
		    controller: {
		    	loadData: function() {
		    		return $g.attributes;
		    	},
		    	insertItem: function(item) {
		    		item.type = 'attribute';
		    		return item;
		    	},
		    	updateItem: function(item) {
		    		return item;
		    	},
		    	deleteItem: function(item) {
		    		return item;
		    	}
		    },
		    onItemUpdated: function(update) {
		    	
	    		if (!update.item.name) {
	    			update.grid.data.splice(update.itemIndex, 1);
	    			$util.errorDialog('Error', 'A name is required for the attribute');
	    		}
	    		else {
			    	$("#wf-input-list").jsGrid('option', 'fields', $util.ioParameters('input'));
			    	$("#wf-output-list").jsGrid('option', 'fields', $util.ioParameters());
	    		}
	    		$("#wf-attributes-list").jsGrid('render');
		    },
		    onItemInserted: function(insert) {
		    	$("#wf-attributes-list").jsGrid('editItem', insert.item);
		    },
		    fields: [
		        { name: 'name', title: 'Name', type: 'text' },
			    {
			    	name: 'dataTypeId',
			    	title: 'Type',
			    	type: 'select',
			    	valueField: 'id',
			    	textField: 'name',
			    	items: $.pluck($g.dataTypes, ['id', 'name']),
			    	selectedIndex: si
			    },
		        { name: 'defaultValue', title: 'Initial Value', type: 'text' },
		        { name: 'description', title: 'Description', type: 'text' },
		        { name: 'use_current', title: 'Current', type: 'checkbox' },
		        { type: 'control' }
		    ]
		});
		

		
		

		
		/**
		 * bind the jsPlumb events
		 */
		// before a new connection is made
	    $g.diagram.bind('beforeDrop', function(info) {
	        return info.sourceId !== info.targetId;
	    });
	    
	    // when a new connection is made
	    $g.diagram.bind('connection', function(info, event) {
	    	
	    	// get the connection type
	    	var type = info.sourceEndpoint.anchor.type;
	    	var source = info.source.id;
	    	var target = info.target.id;
	    	
	    	// connect the appropriate
	    	if (type === $g.conn.success) {
	    		$g.steps[source].success = $g.steps[target].id;
	    	}
	    	else if (type === $g.conn.fail) {
	    		$g.steps[source].fail = $g.steps[target].id;
	    	}
	    	else if (type === $g.conn.exception) {
	    		$g.steps[source].exception = $g.steps[target].id;
	    	}
	    });
	    
	    // when a connection is removed
	    $g.diagram.bind('connectionDetached', function(info, event) {
	    	
	    	// get the connection type
	    	var type = info.sourceEndpoint.anchor.type;
	    	var source = info.source.id;
	    	var target = info.target.id;
	    	
	    	// connect the appropriate
	    	if (type === $g.conn.success) {
	    		$g.steps[source].success = null;
	    	}
	    	else if (type === $g.conn.fail) {
	    		$g.steps[source].fail = null;
	    	}
	    	else if (type === $g.conn.exception) {
	    		$g.steps[source].exception = null;
	    	}
	    });


		$.contextMenu({
	        selector: '.connectable',
	        callback: function(key, options) {
	        	console.log(options);
	        	if (key === 'edit') {
	        		$edit.editStep(options.$trigger.attr('id'));
	        	}
	        	else if (key === 'delete') {
	        		$edit.removeStep(options);
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
		
		
		// set up panzoom with firefox compatibility
		$g.panzoom = $g.workarea.panzoom();

		// set up the scroll zoom
		$g.panzoom.parent().on('mousewheel.focal DOMMouseScroll', function(e) {

			// require the shift key to scroll so that normal page scroll can take place
			if (e.shiftKey) {
				
				// calculate the offset
				e.preventDefault();
				
				// for firefox set the wheel delta to negative
				var ffWheel = e.originalEvent.detail * -1;
				
				// determine the delta
				var delta = e.delta || e.originalEvent.wheelDelta || ffWheel;
				var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
				var dc = document.getElementById($g.workarea.attr('id'));
				var offsetX = Math.abs(dc.offsetLeft) + e.originalEvent.clientX;
				var offsetY = Math.abs(dc.offsetTop) + e.originalEvent.clientY;

				// set the focal point
				var focal = {
					clientX : offsetX,
					clientY : offsetY
				};

				// zoom in on the focal point
				$g.panzoom.panzoom('zoom', zoomOut, {
					increment : 0.1,
					animate : false,
					silent : false,
					focal : focal
				});
			}
		});
	};
	
	/**
	 * Adds end points to the step
	 * 
	 */
	var addEndpoints = function (toId, e) {
		
		if (e.success) {
	        var successUUID = toId + e.success;
	        $g.diagram.addEndpoint(toId, endpointConfig('success'), {
	            anchor: e.success,
	            uuid: successUUID
	        });
		}
		if (e.fail) {
	        var failUUID = toId + e.fail;
	        $g.diagram.addEndpoint(toId, endpointConfig('fail'), {
	        	anchor: e.fail,
	        	uuid: failUUID
	        });
		}
		if (e.exception) {
	        var exceptUUID = toId + e.exception;
	        $g.diagram.addEndpoint(toId, endpointConfig('exception'), {
	        	anchor: e.exception,
	        	uuid: exceptUUID
	        });
		}
		if (e.target) {
	        var targetUUID = toId + e.target;
	        $g.diagram.addEndpoint(toId, targetEndpoint, {
	        	anchor: e.target,
	        	uuid: targetUUID
	        });
		}
	};
	
	
	// return functions
	return {
		addEndpoints: addEndpoints,
		updateMagnets: updateMagnets,
		init: init,
		endpointConfig: endpointConfig,
		targetEndpoint: targetEndpoint
	};
	
});