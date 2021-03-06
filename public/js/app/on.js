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
	    'wf-save',
	    'jquery-ui',
	    'jquery-panzoom'
	],
	function($, $g, $ui, $edit, $item, $save) {
	
	
	// when a node is double clicked
	$(document).on('dblclick', '.connectable', function() {
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
		$save.workflowConnections();
	});
	
	$g.toolbarRun.on('click', function() {
		$edit.newRun();
	});
	
	$g.toolbarReset.on('click', function() {
		$g.workarea.panzoom('reset');
	});
	$g.toolbarVersion.on('click', function() {
		$edit.versionOptions();
	});
	
	$g.toolbarNew.on('click', function() {
		$edit.newWorkflow();
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
        	
        	var activityId = ui.draggable.attr('wfActivityId');
        	var workflowId = ui.draggable.attr('wfWorkflowId');

        	// remove the helper
        	ui.helper.remove();
        	
        	// create the step
        	var step = {
        		workflow: $g.wf.id,
                label: ui.draggable.attr('wfItemLabel'),
                type: ui.draggable.attr('wfItemType')
            };
        	
        	if (activityId && activityId !== '') {
        		step.activity = activityId;
        	}
        	else if (workflowId && workflowId !== '') {
        		step.subWorkflow = workflowId;
        	}

        	// add the step to the workspace
            var uiStep   = $item.addItem(step, null, ui.offset, $g.iconSize);
            
            var position = {
            	position: {
                	left: ui.offset.left + ($g.workarea.width() / 2),
                	top: ui.offset.top + ($g.workarea.height() / 2)
            	}
            };
            
            // add the position
            step.ui = JSON.stringify(position);

            // create the step
            $item.newItem($g.wfpath + '/steps', step, uiStep);
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