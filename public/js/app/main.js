/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(
	[
        'jquery',
    	'wf-global',
    	'wf-load',
    	'wf-util',
    	'wf-ui',
    	'socketio',
    	'wf-canvas',
    	'wf-item',
    	'wf-edit',
    	'jquery-ui',
    	'jquery-context',
    	'jsgrid',
    	'jsplumb',
    	'jquery-panzoom',
    	'wf-on',
    	'wf-dialog',

    ],
    function($, $g, $load, $util, $ui, io) {
	
		// allow html in dialog headers
		$.widget('ui.dialog', $.extend({}, $.ui.dialog.prototype, {
		    _title: function(titleBar) {
		        titleBar.html(this.options.title || '&#160;');
		    }
		}));
		
		
	/**
	 * call the initialization functions
	 */
	$(document).ready(function() {
		
		// create a socket.io connection
		$g.socket   = io.connect('http://localhost:8080', {
			reconnection: false
		});

		$g.socket.on('connection', function(msg) {
			
			console.log('socket.io is', msg);
		});
		
		$g.socket.on('log', function(msg) {
			
			console.log('log message sent', msg);
		});
		
		
		// get the id
		var id      = $util.getURLParameter('id');
		var editing = ($util.getURLParameter('editing') === 'true') ? true : false;
		var version = $util.getURLParameter('version') || null;
		
		// if a version was entered
		if (version && isNaN(version)) {
			try {
				version = (new Date(version)).getTime();
			}
			catch (err) {
				version = null;
			}
		}
		
		// default to the current time
		version = version ? version : (new Date()).getTime();
		
		// if there was an id, try to init the canvas
		if (id) {
			$g.load = $load;
		    $load.loadWorkflow(id, editing, version);
		    $load.loadMenuItems(id);
		    $load.loadDataTypes();

		}
		else {
			$ui.positionWorkarea();
			$ui.positionElements();
		}
	});
});
