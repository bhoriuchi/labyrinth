/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(
	[
	    'jquery',
	    'wf-global',
	    'wf-ui',
	    'wf-edit',
	    'wf-item',
	    'jquery-ui',
	    'jquery-panzoom'
	],
	function($, $g, $ui, $edit, $item) {
	// when a node is double clicked
	$(document).on('dblclick', '.connectable', function() {
		//console.log('dropped', $(this));
		// get the id
		var id = $(this)[0].id;
		$edit.editStep(id);
	});
	
	// set the menu position on window resize
	$( window ).resize(function() {
		var show = ($g.menu.css('display') === 'none') ? false : true;
		if (show) {
			$ui.positionElements();
		}
		else {
			$g.menu.show();
            $ui.positionElements();
           $g.menu.hide();
		}
	});
	
	$g.toolbarEdit.on('click', function() {
		$edit.editWorkflow();
	});
	
	$g.toolbarSave.on('click', function() {
		$ui.updateUiPositions();
	});
	
	$g.toolbarReset.on('click', function() {
		$g.workarea.panzoom('reset');
	});
	$g.toolbarVersion.on('click', function() {
		$edit.versionOptions();
	});
	
	$('#wf-publish-btn').on('click', function() {
		$edit.publish();
		return false;
	});
	
	
	$g.menuToggle.on('click', function() {
		$ui.toggleMenu();
	});
	
    $g.droparea.droppable({
    	accept: '.menuObject',
        drop: function(e, ui) {
        	
        	// remove the helper
        	ui.helper.remove();
        	
        	// create the step
        	var step = {
                id: ui.draggable.attr('wfItemId'),
                label: ui.draggable.attr('wfItemLabel'),
                activity: {
                    type: ui.draggable.attr('wfItemType')
                }
            };
        	
        	console.log('ui', ui, 'step', step);
        	
        	// add the step to the workspace
            var uiStep   = $item.addItem(step, null, ui.offset, $g.iconSize);
            var position = {
            	left: ui.offset.left + ($g.workarea.width() / 2),
            	top: ui.offset.top + ($g.workarea.height() / 2)
            };
            
            // create the step
            $item.newItem($g.wfpath + '/steps', {
            	activity: ui.draggable.attr('wfActivity'),
            	label: step.label,
            	workflow: $g.wf.id,
            	type: step.activity.type,
            	ui: JSON.stringify(position)
            }, uiStep);
        }
    });
    
	$('#wf-step-wait').on('change', function() {
		if ($(this).prop('checked')) {
			$('#wf-step-requirekey-form').fadeIn();
		}
		else {
			$('#wf-step-requirekey-form').fadeOut(function() {
				$('#wf-step-requirekey').prop('checked', false);
			});
			
		}
	});
	
	$('.dialog-btn-cancel').on('click', function() {
		$('#' + $(this).attr('wfDialog')).dialog('close');
	});
	
	
	$('.new-param').on('click', function() {
		var type = $(this).attr('wfParamType');
		if (type === 'attribute') {
			$('#wf-attributes-list').jsGrid('insertItem');
		}
		else if (type === 'input') {
			$('#wf-input-list').jsGrid('insertItem');
		}
		else if (type === 'output') {
			$('#wf-output-list').jsGrid('insertItem');
		}
	});
	
});