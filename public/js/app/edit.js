/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-util', 'wf-canvas'], function($, $g, $util, $canvas) {
	
	
	var publish = function(force) {

		var forceQs = (force === true) ? '?force=true' : '';
		$g.verModal.dialog('close');
		$g.loadingModal.dialog('open');
		
	    $.ajax({
	        url : $g.wfpath + '/workflows/' + $g.wf.id + '/publish' + forceQs,
	        method : 'POST',
	        crossDomain : true,
	        headers : {
	            'Accept' : 'application/json'
	        },
	        dataType: 'json',
	        contentType: 'application/json'
	    })
	    .done(function(data, status, xhr) {
	    	$g.confirmModal.dialog('close');
	    	$util.okDialog('Successfully Published!', 'Successfully published version ' + data[0].current_version);
	    })
	    .fail(function(xhr, status, err) {
	    	
	    	if (xhr.responseJSON && xhr.responseJSON.error === 'ER_COULD_NOT_PUBLISH_RELATION') {
	    		$util.confirmDialog(' Force Publish?', 'One or more dependents require publishing in order to publish this workflow. Select OK to force dependent publishing or Cancel to quit', publish, [true]);
	    	}
	    	else {
	    		$g.confirmModal.dialog('close');
	    		$util.errorDialog('Error', xhr.responseJSON.message + '<br><br>' + xhr.responseJSON.details);
	    	}
	    })
	    .always(function() {
	    	$g.loadingModal.dialog('close');
	    });
	};

	var editWorkflow = function() {
		
		$util.removeBlanks($g.attributes);
		$('#wf-wf-name').val($g.wf.name);
		$('#wf-wf-description').val($g.wf.description);
		$('#wf-wf-usecurrent').prop('checked', $g.wf.use_current);
		$g.wfModal.dialog('option', 'title', 'Edit Workflow - ' + $g.wf.name);
		$g.wfModal.dialog('open');
		$("#wf-attributes-list").jsGrid("render");
	};
	
	
	var newRun = function() {
		
		// first get the current workflow parameters
		$g.loadingModal.dialog('open');
		
        $.ajax({
            url : $g.wfpath + '/workflows/' + $g.wf.id + '?version=0&fields=parameters',
            method : 'GET',
            crossDomain : true,
            headers : {
                'Accept' : 'application/json'
            },
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(wf, status, xhr) {
        	
        	var inputs = [];
        	
        	if (Array.isArray(wf.parameters)) {
        		$.each(wf.parameters, function(idx, param) {
        			if (param.type === 'input' && !param.mapAttribute) {
        				inputs.push(param);
        			}
        		});
        	}
        	
        	//console.log(wf);
        	console.log(inputs);
        })
        .fail(function(xhr, status, err) {
        	$util.errorDialog('Failed', 'Failed to get workflow ' + $g.wf.name);
        	console.log('failed', xhr, status, err);
        })
        .always(function() {
        	$g.loadingModal.dialog('close');
        });
		
	};
	
	
	var newWorkflow = function() {
		
		// add the form
		$('#wf-prompt-modal-detail').html('<form class="form-horizontal">' +
				'<div class="form-group">' +
				'    <label for="wf-new-name" data-toggle="tooltip" title="New workflow name" class="control-label col-xs-3">Name:</label>' +
                '    <div class="col-xs-9">' +
                '        <input id="wf-new-name" type="text" name="wf-new-name" value="" class="form-control">' +
                '    </div>' +
				'    <label for="wf-new-description" data-toggle="tooltip" title="New workflow description" class="control-label col-xs-3">Description:</label>' +
                '    <div class="col-xs-9">' +
                '        <input id="wf-new-description" type="text" name="wf-new-description" value="" class="form-control">' +
                '    </div>' +
            	'</div>');
		
		// bind the click operation
		$('#wf-prompt-ok-button').off();
		$('#wf-prompt-ok-button').on('click', function() {
			
			// get the form values
			var name = $('#wf-new-name').val();
			var desc = $('#wf-new-description').val() || '';
			
			// check for a name
			if (!name || name === '') {
				$util.errorDialog('Missing Input', 'A new workflow name is required');
				return false;
			}
			
			// close the prompt modal and open the loading one
			$g.promptModal.dialog('close');
			$g.loadingModal.dialog('open');
			
			// create a new message body
			var msg = {
				name: name,
				description: desc
			};

	        $.ajax({
	            url : $g.wfpath + '/workflows',
	            method : 'POST',
	            crossDomain : true,
	            headers : {
	                'Accept' : 'application/json'
	            },
	            dataType: 'json',
	            contentType: 'application/json',
	            data: JSON.stringify(msg)
	        })
	        .done(function(data, status, xhr) {
	        	
	        	if (data.id) {
	        		window.location = '/wf?id=' + data.id + '&editing=true';
	        	}
	        	else {
	        		$g.promptModal.dialog('close');
	        		$util.errorDialog('Failed', 'Failed to create a new workflow');
	        	}
	        })
	        .fail(function(xhr, status, err) {
	        	$util.errorDialog('Failed', 'Failed to create a new workflow');
	        	console.log('failed', xhr, status, err);
	        })
	        .always(function() {
	        	$g.loadingModal.dialog('close');
	        });
		});
		
		// change the header and open
		$g.promptModal.dialog('option', 'title', 'New Workflow');
		$g.promptModal.dialog('open');
	};


	var editStep = function(id, editing) {
		
		var draft = (editing === false) ? '' : '?version=0';
		
		// get the step
		var step = $g.steps[id];
		
		// open the dialog
		if (!step.activity || !step.activity.readonly) {
			
			$g.loadingModal.dialog('open');
			
	        $.ajax({
	            url : $g.wfpath + '/steps/' + step.id + draft,
	            method : 'GET',
	            crossDomain : true,
	            headers : {
	                'Accept' : 'application/json'
	            },
	            dataType: 'json',
	            contentType: 'application/json'
	        })
	        .done(function(step, status, xhr) {
	        	
	        	$g.steps[id] = step;

				if (step.source) {
					$g.codemirror.setValue(step.source);
				}
				else {
					$g.codemirror.setValue('');
				}
				
				$util.updateParams(id, step.parameters);
				
				// set the form values
	        	$('#wf-step-id').val(id);
				$('#wf-step-name').val(step.label);
				$('#wf-step-timeout').val(step.timeout);
				$('#wf-step-usecurrent').prop('checked', step.use_current);
				$('#wf-step-failworkflow').prop('checked', step.failsWorkflow);
				$('#wf-step-wait').prop('checked', step.waitOnSuccess);
				$('#wf-step-requirekey').prop('checked', step.requireKey);
				
				// determine if fields need to be hidden
				if (step.waitOnSuccess) {
					$('#wf-step-requirekey-form').show();
				}
				else {
					$('#wf-step-requirekey').prop('checked', false);
					$('#wf-step-requirekey-form').hide();
				}
				
				
				$g.editModal.dialog('option', 'title', 'Edit Step - ' + step.label);
				$g.editModal.dialog('open');

				
				$("#wf-input-list").jsGrid({
				    width: "100%",
				    height: "395px",
				    editing: true,
				    rowClick: function() {return false;},
				    autoload: true,
				    controller: {
				    	loadData: function() {
				    		return $g.steps[id]._input;
				    	},
				    	insertItem: function(item) {
				    		item.type = 'input';
				    		return item;
				    	},
				    	updateItem: function(item) {
				    		return item;
				    	},
				    	deleteItem: function(item) {
				    		return item;
				    	}
				    },
				    onItemInserted: function(insert) {
				    	$("#wf-input-list").jsGrid('editItem', insert.item);
				    },
				    onItemUpdating: function(args) {
				    	var attr = $util.select($g.attributes, function(attr) { return attr.id === args.item.mapAttribute;});

				    	if (attr && args.item.dataTypeId !== attr.dataTypeId) {
				    		args.cancel = true;
				    		$util.errorDialog('Error', 'The attribute and input parameter do not have the same data type and cannot be mapped');
				    	}
				    },
				    onItemUpdated: function(update) {
			    		if (!update.item.name) {
			    			update.grid.data.splice(update.itemIndex, 1);
			    			$util.errorDialog('Error', 'A name is required for the input parameter');
			    		}
		    			$("#wf-input-list").jsGrid('render');
				    },
				    fields: $util.ioParameters('input')
				});
				
				$("#wf-output-list").jsGrid({
				    width: "100%",
				    height: "395px",
				    editing: true,
				    rowClick: function() {return false;},
				    autoload: true,
				    controller: {
				    	loadData: function() {
				    		return $g.steps[id]._output;
				    	},
				    	insertItem: function(item) {
				    		item.type = 'output';
				    		return item;
				    	},
				    	updateItem: function(item) {
				    		return item;
				    	},
				    	deleteItem: function(item) {
				    		return item;
				    	}
				    },
				    onItemInserted: function(insert) {
				    	$("#wf-output-list").jsGrid('editItem', insert.item);
				    },
				    onItemUpdated: function(update) {
			    		if (!update.item.name) {
			    			update.grid.data.splice(update.itemIndex, 1);
			    			$util.errorDialog('Error', 'A name is required for the output parameter');
			    		}
		    			$("#wf-output-list").jsGrid('render');
				    },
				    onItemUpdating: function(args) {
				    	var attr = $util.select($g.attributes, function(attr) { return attr.id === args.item.mapAttribute;});
				    	if (attr && args.item.dataTypeId !== attr.dataTypeId) {
				    		args.cancel = true;
				    		$util.errorDialog('Error', 'The attribute and output parameter do not have the same data type and cannot be mapped');
				    	}
				    },
				    fields: $util.ioParameters()
				});
				
				if (step.type !== 'workflow') {
					$('#wf-tab-source-tab').show();
					$g.codemirror.refresh();
				}
				else {
					$('#wf-tab-source-tab').hide();
					
					if ($g.editTabs.tabs('option', 'active') === 3) {
						$g.editTabs.tabs('option', 'active', '0');
					}
				}
	        })
	        .fail(function(xhr, status, err) {
	        	console.log('failed', xhr, status, err);
	        })
	        .always(function() {
	        	$g.loadingModal.dialog('close');
	        });
		}
	};
	
	
	var versionOptions = function() {
		
		$('#wf-version-comment').val($g.wf.change_notes);

		if ($g.wf.active) {
			$('#wf-activate-btn').removeClass('btn-success').addClass('btn-default').prop('disabled', true);
			$('#wf-deactivate-btn').removeClass('btn-default').addClass('btn-danger').prop('disabled', false);
		}
		else {
			$('#wf-activate-btn').removeClass('btn-default').addClass('btn-success').prop('disabled', false);
			$('#wf-deactivate-btn').removeClass('btn-danger').addClass('btn-default').prop('disabled', true);
		}
		
		$g.verModal.dialog('option', 'title', 'Version Options - ' + $g.wf.name);
		$g.verModal.dialog('open');
	};
	
	
	
	return {
		newRun: newRun,
		newWorkflow: newWorkflow,
		editStep: editStep,
		publish: publish,
		editWorkflow: editWorkflow,
		versionOptions: versionOptions
	};
});