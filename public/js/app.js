/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
requirejs.config({
	paths: {
		'biltong'       : 'vendor/biltong-0.2',
		'bootstrap'     : 'vendor/bootstrap.min',
		'farahey'       : 'vendor/farahey-0.5',
		'jquery'        : 'vendor/jquery-1.11.2.min',
		'jquery-ui'     : 'vendor/jquery-ui-1.11.4.min',
		'jquery-context': 'vendor/jquery.contextMenu.min',
		'jquery-panzoom': 'vendor/jquery.panzoom-2.0.5',
		'jsgrid'        : 'vendor/jsgrid.min',
		'jsplumb'       : 'vendor/jsPlumb-1.7.9-min',
		'wf-canvas'     : 'app/canvas',
		'wf-dialog'     : 'app/dialog',
		'wf-edit'       : 'app/edit',
		'wf-global'     : 'app/global',
		'wf-item'       : 'app/item',
		'wf-load'       : 'app/load',
		'wf-on'         : 'app/on',
		'wf-save'       : 'app/save',
		'wf-ui'         : 'app/ui',
		'wf-util'       : 'app/util'
	},
	packages: [
	    {
	    	name: "codemirror",
		    location: "vendor/cm",
		    main: "lib/codemirror"
		}
	],
	shim: {
		'jquery': {
			exports: '$'
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'jquery-ui': {
			deps: ['jquery']
		},
		'jsPlumb': {
			deps: ['jquery', 'jquery-ui', 'biltong', 'farahey'],
			exports: 'jsPlumb'
		},
		'jquery-panzoom': {
			deps: ['jquery'],
			exports: 'jQuery.panzoom'
		},
		'jquery-context': {
			deps: ['jquery'],
			exports: 'jQuery.contextMenu'
		},
		'jsgrid': {
			deps: ['jquery'],
			exports: 'jQuery.jsGrid'
		},
		'farahey': {
			deps: ['biltong'],
			exports: 'Magnetizer'
		}
	}
});

requirejs(['app/main']);