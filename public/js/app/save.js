/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(
	[
	 	'jquery',
        'wf-global',
        'wf-util'
    ],
function($, $g, $util) {
	
	function prepareParams(params, scope, id) {
		
		var parameters = [];
		
		// format the parameters
		$.each(params, function(idx, param) {
			var p;
			if (typeof(param) === 'object') {
				
				p = {
					name: param.name,
					description: param.description,
					dataType: param.dataTypeId || param.dataType.id,
					scope: scope,
					type: param.type,
					use_current: param.use_current,
					required: param.required,
					workflow: $g.wf.id,
					mapAttribute: (!param.mapAttribute || param.mapAttribute === '') ? '' : param.mapAttribute
				};

				if (scope === 'step') {
					p.step = id;
				}
				else if (scope === 'workflow') {
					delete p.required;
					delete p.mapAttribute;
					p.defaultValue = param.defaultValue;
				}
					
				if (param.id) {
					p.id = param.id;
				}
			}
			else {
				p = param;
			}
			parameters.push(p);
		});
		
		return parameters;
	}
		
		
	var step = function() {
		
		// get step and params
		var id         = $('#wf-step-id').val();
		var s          = $g.steps[id];
		var timeout    = $('#wf-step-timeout').val();
		var params     = s.parameters;
		var parameters = prepareParams(params, 'step', s.id);
		
		// gather the data
		var msg = {
			label: $('#wf-step-name').val(),
			timeout: !isNaN(timeout) ? parseInt(timeout, 10) : 0,
			use_current: $('#wf-step-usecurrent').prop('checked'),
			failsWorkflow: $('#wf-step-failworkflow').prop('checked'),
			waitOnSuccess: $('#wf-step-wait').prop('checked'),
			requireKey: $('#wf-step-requirekey').prop('checked'),
			parameters: parameters
		};
		
		// add the source if applicable
		if (!s.activity && !s.subWorkflow) {
			msg.source = $g.codemirror.getValue();
			
			// determine modules to load
			
			
		}

		$g.loadingModal.dialog('open');
		
	    $.ajax({
	        url : $g.wfpath + '/steps/' + s.id,
	        method : 'PUT',
	        crossDomain : true,
	        headers : {
	            'Accept' : 'application/json'
	        },
	        dataType: 'json',
	        contentType: 'application/json',
	        data: JSON.stringify(msg)
	    })
        .done(function(step, status, xhr) {
        	step.success   = $g.steps[id].success;
        	step.fail      = $g.steps[id].fail;
        	step.exception = $g.steps[id].exception;
        	$g.steps[id]   = step;
        	$util.updateParams(id, step.parameters);
        	
        	// re-render the grids 
        	$("#wf-input-list").jsGrid("render");
        	$("#wf-output-list").jsGrid("render");
        	
        	// update the label
        	$('#itemlabel-' + id).html('<span>' + msg.label + '</span>');
        	
        })
        .fail(function(xhr, status, err) {
        	console.log('failed', xhr, status, err);
        	$util.errorDialog('Error', xhr.responseJSON.message + '<br><br>' + xhr.responseJSON.details);
        })
        .always(function() {
        	$g.loadingModal.dialog('close');
        });
	    
	};
	
	var workflowProperties = function() {
		
		// get the attributes
		var params = prepareParams($g.attributes, 'workflow', $g.wf.id);
		
		// get the rest of the parameters
		$.each($g.steps, function(idx, step) {

			params = params.concat(prepareParams($util.filter(step.parameters, function(val, idx) {
				return val.type === 'input';
			}), 'step', step.id));
			
			params = params.concat(prepareParams($util.filter(step.parameters, function(val, idx) {
				return val.type === 'output';
			}), 'step', step.id));
		});
		
		console.log($g.attributes);
		
		var msg = {
			name: $('#wf-wf-name').val(),
			description: $('#wf-wf-description').val(),
			use_current: $('#wf-wf-usecurrent').prop('checked'),
			parameters: params
		};
		
		$g.loadingModal.dialog('open');
		
	    $.ajax({
	        url : $g.wfpath + '/workflows/' + $g.wf.id,
	        method : 'PUT',
	        crossDomain : true,
	        headers : {
	            'Accept' : 'application/json'
	        },
	        dataType: 'json',
	        contentType: 'application/json',
	        data: JSON.stringify(msg)
	    })
        .done(function(wf, status, xhr) {
  	
        	$g.wf = wf;
        	
        	// update the attributes
        	$g.attributes = $util.filter(wf.parameters, function(param) {
        		return param.type === 'attribute';
        	});
        	$.each($g.attributes, function(idx, attr) {
        		$g.attributes[idx].dataTypeId = attr.dataType.id;
        	});
        	
        	
        	// re-render the grid
        	$("#wf-attribute-list").jsGrid("render");
        	$('#wf-header').html(msg.name);
        })
        .fail(function(xhr, status, err) {
        	console.log('failed', xhr, status, err);
        	$util.errorDialog('Error', xhr.responseJSON.message + '<br><br>' + xhr.responseJSON.details);
        })
        .always(function() {
        	$g.loadingModal.dialog('close');
        });
	};
	
	
	var workflowConnections = function() {
		
		var steps = [];
		
		$('.connectable').each(function(idx, item) {

			var step = $g.steps[$(item).attr('id')];
			
			var position = {
				position: {
					left: $(item).offset().left + ($g.workarea.width() / 2),
					top: $(item).offset().top + ($g.workarea.height() / 2)
				}
			};
			
			steps.push({
				id: step.id,
				success: step.success,
				fail: step.fail,
				exception: step.exception,
				ui: JSON.stringify(position)
			});
		});
		
		var msg = {
			steps: steps,
			ui: JSON.stringify({position: $g.workarea.position()})
		};
		
		$g.loadingModal.dialog('open');
		
	    $.ajax({
	        url : $g.wfpath + '/workflows/' + $g.wf.id,
	        method : 'PUT',
	        crossDomain : true,
	        headers : {
	            'Accept' : 'application/json'
	        },
	        dataType: 'json',
	        contentType: 'application/json',
	        data: JSON.stringify(msg)
	    })
        .fail(function(xhr, status, err) {
        	console.log('failed', xhr, status, err);
        	$util.errorDialog('Error', xhr.responseJSON.message + '<br><br>' + xhr.responseJSON.details);
        })
        .always(function() {
        	$g.loadingModal.dialog('close');
        });
	};
	
		
	// return the functions
	return {
		step: step,
		workflowProperties: workflowProperties,
		workflowConnections: workflowConnections
	};
});