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
    	'wf-canvas',
    	'wf-item',
    	'wf-edit',
    	'jquery-ui',
    	'jquery-context',
    	'jsgrid',
    	'jsplumb',
    	'jquery-panzoom',
    	'wf-on',
    	'wf-dialog'
    ],
    function($, $g, $load, $util, $ui) {
	
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
		    $load.loadWorkflow(id, editing, version);
		    $load.loadMenuItems();

		}
	});
});
