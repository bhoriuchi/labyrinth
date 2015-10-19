/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-util', 'wf-canvas'], function($, $g, $util, $canvas) {
	
	var importAttributes = function() {
		
		var ops = [];
		
		$('#wf_import_attributes tr').each(function(idx, row) {
			var step = $(row).attr('wfStepId');
			var id   = $(row).attr('wfImportId');
			var name = $('#import_og_' + id).val();
			var act  = $('#import_act_' + id).val();
			var val  = $('#import_val_' + id).val();
			var obj  = $g.attrs[id];

			console.log('attrs', $g.attrs);
			
			if (act === 'import') {
				ops.push({
					scope: 'workflow',
					replicaOf: obj.id,
					name: val,
					type: obj.type,
					defaultValue: obj.defaultValue,
					description: obj.description,
					dataType: obj.dataType,
					workflow: $g.wf.id
				});
			}
			else if (act === 'merge') {
				$.each($g.steps[step].parameters, function(idx, param) {
					
					console.log(param.mapAttribute, '===', val);
					
					if (param.mapAttribute === val) {
						ops.push({
							id: param.id,
							mapAttribute: val
						});
					}
				});
			}
			
			$g.loadingModal.dialog('open');
			
			console.log('OPS', ops);
			
	        $.ajax({
	            url : $g.wfpath + '/parameters',
	            method : 'POST',
	            crossDomain : true,
	            headers : {
	                'Accept' : 'application/json'
	            },
	            dataType: 'json',
	            contentType: 'application/json',
	            data: JSON.stringify(ops)
	        })
			.done(function(data, status, xhr) {
				
				console.log('step save', data, status, xhr);
				if (Array.isArray(data)) {
					$.each(data, function(idx, attr) {
						var found = false;
						for (var i = 0; i < $g.attributes.length; i++) {
							if ($g.attributes[i].id === attr.id) {
								found = true;
								$g.attributes[i] = attr;
								break;
							}
						}
						if (!found) {
							$g.attributes.push(attr);
						}
					});
				}

				
				$g.attrModal.dialog('close');
			})
			.fail(function(xhr, status, err) {
				console.log(xhr);
				$util.errorDialog('Error', xhr.responseJSON.message + '<br><br>' + xhr.responseJSON.details);
			})
		    .always(function() {
		    	$g.loadingModal.dialog('close');
		    });
		});
	};
	
	
	/**
	 * creates a new item
	 */
	var newItem = function(path, body, step) {
		
		var scope;
		var id = step.attr('id');
		var attrs = [];

		// basic message body
		var msg = {
			label: body.label,
			type: body.type,
			workflow: body.workflow,
			ui: body.ui
		};
		
		if (body.type === 'task' && body.activity !== 'task') {
			msg.activity = body.activity;
			scope = 'activity';
		}
		else if (body.type === 'workflow') {
			msg.subWorkflow = body.subWorkflow;
			scope = 'workflow';
		}
		else {
			msg.source = '';
			scope = 'step';
		}
		
		console.log('messageBody', msg);
		
		if (msg) {
	        $.ajax({
	            url : path + '?maxdepth=1',
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
	        	step.attr('wfItemId', data.id);
	        	$g.steps[id] = data;
	        	
	        	
	        	if (scope === 'workflow') {
		        	// get the attributes
		        	$.each(data.subWorkflow.parameters, function(idx, param) {
		        		if (param.type === 'attribute') {
		        			param.dataType = param.dataType.id;
		        			attrs.push(param);
		        		}
		        	});
	        	}
	
	        	
	        	if (attrs.length > 0) {
	        		
	        		// initialize the global attrs object
	        		$g.attrs = {};
	        		
	        		
	        		var html = 	'<table class="table table-striped">' +
	        					'<thead>' +
	        					'  <tr>' +
	        					'    <th class="col-xs-4">Attribute</th>' +
	        					'    <th class="col-xs-4">Action</th>' +
	        					'    <th class="col-xs-4">As</th>' +
	        					'  </tr>' +
	        					'</thead>' +
	        					'<tbody id="wf_import_attributes">';
	        		
	        		$.each(attrs, function(idx, attr) {
	        			
	        			$g.attrs[attr.id] = attr;
	        			
	        			// prepare the html for merge
	        			var ddHtml = '<select id="import_val_' + attr.id + '" class="attr-form">';
	        			var recommendMerge = false;
	        			
	        			$.each($g.attributes, function(idx, gattr) {
	        				
	        				ddHtml += '<option value="' + gattr.id + '"';
	        				
	        				if (gattr.name === attr.name) {
	        					ddHtml += 'selected';
	        					recommendMerge = true;
	        				}
	        				
	        				ddHtml += '>' + attr.name + '</option>';
	        			});
	        			
	        			ddHtml += '</option>';
	        			
	        			// add a row
	        			html += '  <tr wfStepId= "' + id + '" wfImportId="' + attr.id + '">' +
	        					'    <td class="col-xs-4">' +
	        					'      <input type="text" id="import_og_' + attr.id + '" value="' + attr.name + '" class="attr-form transparent-form" readonly>' +
	        					'    <td class="col-xs-4">' +
	        					'      <select id="import_act_' + attr.id + '" class="attr-form" wfImportAttrId="' + attr.id + '">' +
	        					'        <option value="import">import</option>' +
	        					'        <option value="merge"';
	        			
	        			if (recommendMerge) {
	        				html += 'selected';
	        			}
	        			
	        			
	        			html += '>merge</option>' +
	        					'        <option value="omit">omit</option>' +
	        					'      </select>' +
	        					'    </td>' +
	        					'    <td class="col-xs-4" id="import_as_' + attr.id + '">';
	        			
	        			if (recommendMerge) {
	        				html += ddHtml;
	        			}
	        			else {
	        				html +=	'      <input id="import_val_' + attr.id + '" type="text" value="' + attr.name + '" class="attr-form">';
	        			}
	        			
	        			
	        			html += '    </td>' +
	        					'  </tr>';
	        		});
	        		
	        		html += '</tbody>' +
	        				'</table>';
	        		
	        		
	        		$g.attrModal.html(html);
	        		$g.attrModal.dialog('open');
	        		
	        		console.log('attrs', attrs);
	        	}
	        })
	        .fail(function(xhr, status, err) {
	        	console.log('failed', xhr, status, err);
	        	step.remove();
	        });
		}
		else {
			step.remove();
		}
	};


	
	
	/**
	 * connect the nodes
	 */
	var connectItems = function(data) {
		$.each(data.steps, function(index, step) {

			// connect success
			if (step.success && step.success !== step.id) {
				$g.diagram.connect({
					uuids:[
					    step.htmlId + $g.conn.success,
					    $util.findStep(step.success, data) + $g.conn.target
					]
				});
			}
			
			// connect fail
			if (step.fail && step.fail !== step.id) {
				$g.diagram.connect({
					uuids:[
					    step.htmlId + $g.conn.fail,
					    $util.findStep(step.fail, data) + $g.conn.target
					]
				});
			}
			
			// connect left
			if (step.exception && step.exception !== step.id) {
				$g.diagram.connect({
					uuids:[
					    step.htmlId + $g.conn.exception,
					    $util.findStep(step.exception, data) + $g.conn.target
					]
				});
			}
		});
	};
	
	
	

	
	/**
	 * add a new step to the workflow
	 * 
	 */
	var addItem = function(step, prev, position, size) {
		
		// set up new variables
		var itemClass, endpoint, posObj, posLbl, end, $newObj, activity;
		
		// check for activity defined at the step level
		activity = step.activity ? step.activity : step;
		
		// initialize a new id and size
		var newId      = 'item_' + (new Date()).getTime();
		var sizeClass  = 'item-md';
		var itemHeight = 75;
		
		// set the size class if specified
		if (size === 'small') {
			sizeClass = 'item-sm';
			itemHeight = 35;
		}
		else if (size === 'large') {
			sizeClass = 'item-lg';
			itemHeight = 100;
		}
		
		// if a position was passed
		if (position) {
			
			// create a using function to offset the element to the offset
			posObj = {
				using: function(pos, fb) {
					$(this).offset(position);
				},
				of: $g.workarea
			};
		}
		else {
			
			// if there is no previous set the previous to the workarea
			// and offset from the top left by 20px in each direction
			if (!prev) {
				prev = $g.workarea;
				posObj = {
					using: function(pos, fb) {
						$(this).css('top', (fb.target.height / 2) + 100);
						$(this).css('left', (fb.target.width / 2) + 100);
					}
				};
			}
			
			// otherwise set it 150px to the right of the previous element
			else {
				posObj = {
					my: 'center',
					at: 'right+150'
				};
			}
		}
		
		// set the label position
		posLbl = {
			my : 'top+5',
			at : 'bottom'
		};
		
		// look at the activity type and add the appropriate endpoints
		// an styles
		if (step.type === 'start') {
			endpoint = {
				success: $g.conn.success
					};
		}
		else if (step.type === 'end') {
			endpoint = {
				target: $g.conn.target
			};
		}
		else {
			endpoint = {
				success: $g.conn.success,
				fail: $g.conn.fail,
				exception: $g.conn.exception,
				target: $g.conn.target
			};
		}
		
		// create an item class
		itemClass = sizeClass + ' item ' + step.type + 'Item';

		console.log(step);
		// create the html for the step
		var stepHTML = 	'<div id="' + newId +
						'" wfItemLabel="' + step.label +
						'" wfItemType="' + step.type +
						'" wfItemId="' + step.id +
						'" wfActivityId="' + $util.exists(step, 'activity.id', '') +
						'" wfWorkflowId="' + $util.exists(step, 'workflow.id', '') +
						'" class="' + sizeClass + ' connectable magnetized">' +
						'    <div class="' + itemClass + '"></div>' +
						'    <div id="itemlabel-' + newId + '" class="itemLabel">' +
						'        <span>' + step.label + '</span>' +
						'    </div>' +
						'</div>';
		
		// add the divs
		$g.workarea.append(stepHTML);
		
		// if no position was specified set the relative position to the previous
		if (!position) {
			posObj.of = prev;
		}
		
		// get the jquery object and position it
		$newObj   = $('#' + newId);
		posLbl.of = $newObj;
		$newObj.position(posObj);
		
		// set the label width and position it
		$('#itemlabel-' + newId).width($('#itemlabel-' + newId + ' > span').outerWidth() + 4);
		$('#itemlabel-' + newId).position(posLbl);

		// add the endpoints and push the new id to the steps array
		$canvas.addEndpoints(newId, endpoint);
		$g.steps[newId] = step;
		$g.elements.push(newId);
		$canvas.updateMagnets($g.elements, $g.workarea);

		// return the created object
		return $newObj;
	};
	
	/**
	 * set up the workarea and viewport and add the initial nodes
	 * 
	 */
	var addItems = function(data, size) {

		var prevElement;
		
		// create the step divs and get the start/end ids
		$.each(data.steps, function(index, step) {
			var pos;
			try {
				pos = JSON.parse(step.ui);
				
				pos = {
					top: pos.top - ($g.workarea.height() / 2),
					left: pos.left - ($g.workarea.width() / 2)
				};
			}
			catch (err) {
				pos = null;
			}
			//pos = null;
			prevElement = addItem(step, prevElement, pos, size);
			data.steps[index].htmlId = prevElement.attr('id');
		});
	};
	
	// return functions
	return {
		importAttributes: importAttributes,
		connectItems: connectItems,
		newItem: newItem,
		addItem: addItem,
		addItems: addItems
	};
});