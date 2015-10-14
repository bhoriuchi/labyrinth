/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-util'], function($, $g, $util) {
	
	
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
	    	$('#wf-ok-modal-detail').html('Successfully published version ' + data[0].current_version);
    		$g.okModal.dialog('option', 'title', ' Successfully Published!');
    		$g.okModal.dialog('open');
	    	console.log('published',data);
	    })
	    .fail(function(xhr, status, err) {
	    	
	    	if (xhr.responseJSON && xhr.responseJSON.error === 'ER_COULD_NOT_PUBLISH_RELATION') {

	    		$('#wf-confirm-modal-detail').html('One or more dependents require publishing in order to publish this workflow. Select OK to force dependent publishing or Cancel to quit');
	    		$('#wf-confirm-button').off();
	    		$('#wf-confirm-button').on('click', function() {
	    			publish(true);
	    		});
	    		$g.confirmModal.dialog('option', 'title', ' Force Publish?');
	    		$g.confirmModal.dialog('open');
	    	}
	    	else {
	    		$('#wf-error-modal-detail').html(xhr.responseJSON.message);
	    		$g.errorModal.dialog('option', 'title', 'Error');
	    		$g.errorModal.dialog('open');
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


	var editStep = function(id) {
		// get the step
		var step = $g.steps[id];
		
		var activity = step.activity ? step.activity : step;

		// open the dialog
		if (!activity.readonly) {
			if (activity && activity.source) {
				$g.codemirror.setValue(activity.source);
			}
			else {
				$g.codemirror.setValue('');
			}
			
			
			// set the form values
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
			$g.codemirror.refresh();
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
		editStep: editStep,
		publish: publish,
		editWorkflow: editWorkflow,
		versionOptions: versionOptions
	};
});