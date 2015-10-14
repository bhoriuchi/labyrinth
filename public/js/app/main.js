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
		var id = $util.getURLParameter('id');
		
		// if there was an id, try to init the canvas
		if (id) {
		    $load.loadWorkflow(id);
		    $load.loadMenuItems();

		}
	});
});
