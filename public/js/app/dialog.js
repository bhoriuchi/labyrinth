/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'jquery-ui'], function($, $g) {
	
	// create the edit dialog
	$g.editModal.dialog({
		autoOpen: false,
		height: $g.editheight,
		width: $g.editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $g.modaltop,
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
	$g.verModal.dialog({
		autoOpen: false,
		height: $g.editheight,
		width: $g.editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $g.modaltop,
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
	$g.wfModal.dialog({
		autoOpen: false,
		height: $g.editheight,
		width: $g.editwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $g.modaltop,
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
	$g.confirmModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: false,
		closeText: false,
		position: {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	$g.confirmModal
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="glyphicon glyphicon-question-sign pull-left"></span>')
	.addClass('dialog-confirm');
	
	
	// create the edit dialog
	$g.okModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	
	// create the edit dialog
	$g.errorModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: false,
		position: {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		}
	});
	$g.errorModal
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>')
	.addClass('dialog-error');
});