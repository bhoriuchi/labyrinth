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
	
	// bind an on change for the import type selector
	$(document).on('change', '[wfImportAttrId]', function() {
		
		var id     = $(this).attr('wfImportAttrId');
		var asform = $('#import_as_' + id);
		var ogform = $('#import_og_' + id);
		
		if (this.value === 'merge') {
			var html = '<select id="import_val_' + id + '" class="attr-form">';
			
			$.each($g.attributes, function(itx, attr) {
				
				html += '<option value="' + attr.id + '"';
				
				if (attr.name === ogform.val()) {
					html += 'selected';
				}
				
				html += '>' + attr.name + '</option>';
			});
			
			html += '</select>';
			
			asform.html(html);

		}
		else if (this.value === 'import') {
			asform.html('<input id="import_val_' + id + '" type="text" value="' + ogform.val() + '" class="attr-form">');
		}
		else if (this.value === 'omit') {
			asform.html('<input type="text" value="" class="attr-form" disabled>');
		}
	});
		
	
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
        	
        	console.log('wfid', workflowId);
        	
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
        	
        	console.log('ui', ui, 'step', step);
        	
        	// add the step to the workspace
            var uiStep   = $item.addItem(step, null, ui.offset, $g.iconSize);
            var position = {
            	left: ui.offset.left + ($g.workarea.width() / 2),
            	top: ui.offset.top + ($g.workarea.height() / 2)
            };
            
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