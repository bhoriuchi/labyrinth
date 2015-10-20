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
	
	function step() {
		
		// get step and params
		var id         = $('#wf-step-id').val();
		var s          = $g.steps[id];
		var timeout    = $('#wf-step-timeout').val();
		var params     = s._input.concat(s._output);
		var parameters = [];
		
		// format the parameters
		$.each(params, function(idx, param) {

			var p = {
				name: param.name,
				description: param.description,
				dataType: param.dataTypeId,
				scope: 'step',
				step: s.id,
				type: param.type,
				use_current: param.use_current,
				required: param.required,
				mapAttribute: (param.mapAttribute === '') ? null : param.mapAttribute
			};
			
			if (param.id) {
				p.id = param.id;
			}
			
			parameters.push(p);
		});
		
		
		// gather the data
		var msg = {
			label: $('#wf-step-name').val(),
			timeout: !isNaN(timeout) ? parseInt(timeout, 10) : 0,
			use_current: $('#wf-step-usecurrent').prop('checked'),
			failsWorkflow: $('#wf-step-failworkflow').prop('checked'),
			waitOnSuccess: $('#wf-step-wait').prop('checked'),
			requireKey: $('#wf-step-requirekey').prop('checked'),
			source: $g.codemirror.getValue(),
			parameters: parameters
		};
		
		
		console.log(JSON.stringify(msg));
		
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
        	console.log('step',step);
        	$g.steps[id] = step;
        })
        .fail(function(xhr, status, err) {
        	console.log('failed', xhr, status, err);
        })
        .always(function() {
        	$g.loadingModal.dialog('close');
        });
	}
		
	// return the functions
	return {
		step: step
	};
});