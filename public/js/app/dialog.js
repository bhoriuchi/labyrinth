/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-item', 'wf-save', 'jquery-ui'], function($, $g, $item, $save) {
	
	$g.loadingModal.css('position', 'relative').dialog({
		autoOpen: false,
		height: 110,
		width: 200,
		modal: true,
		draggable: false,
		resizable: false,
		position: {
			my: 'center top',
			at: 'center top' + $g.loadtop,
			of: $(document)
		}
	})
	.parent()
	.find('.ui-dialog-titlebar')
	.css('display', 'none');
	
	
	// create the edit dialog
	$g.editModal.dialog({
		autoOpen: false,
		height: $g.editheight,
		width: $g.editwidth,
		modal: true,
		draggable: true,
		position: {
			my: 'center top',
			at: 'center top' + $g.modaltop,
			of: $(document)
		},
		buttons: [
		    {
		    	text: 'OK',
		    	click: function() {
		    		$save.step();
		    		$g.editModal.dialog( "close" );
				}
		    },
		    {
		    	text: 'Apply',
		    	click: function() {
		    		$save.step();
				}
		    },
		    {
		    	text: 'Cancel',
		    	click: function() {
		    		$g.editModal.dialog( "close" );
				}
		    },
		],
		close: function() {
			$("#wf-input-list").jsGrid('destroy');
			$("#wf-output-list").jsGrid('destroy');
		}
	});
	
	
	
	// create the edit dialog
	$g.verModal.dialog({
		autoOpen: false,
		height: $g.editheight,
		width: $g.editwidth,
		modal: true,
		draggable: true,
		position: {
			my: 'center top',
			at: 'center top' + $g.modaltop,
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
		draggable: true,
		position: {
			my: 'center top',
			at: 'center top' + $g.modaltop,
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
		draggable: true,
		closeText: false,
		position: {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		}
	})
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="glyphicon glyphicon-question-sign pull-left"></span>')
	.addClass('dialog-confirm');
	
	
	// create the edit dialog
	$g.promptModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: true,
		closeText: false,
		position: {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		}
	})
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="fa fa-question-circle pull-left"></span>');
	
	
	
	// create the edit dialog
	$g.okModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: true,
		position: {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		}
	})
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="glyphicon glyphicon-ok-sign pull-left"></span>')
	.addClass('dialog-ok');
	
	// create the edit dialog
	$g.errorModal.dialog({
		autoOpen: false,
		height: $g.okheight,
		width: $g.okwidth,
		modal: true,
		draggable: true,
		position: {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		}
	})
	.parent()
	.find('.ui-dialog-titlebar')
	.prepend('<span class="glyphicon glyphicon-exclamation-sign pull-left"></span>')
	.addClass('dialog-error');
});