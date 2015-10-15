/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-util', 'wf-canvas'], function($, $g, $util, $canvas) {
	
	/**
	 * creates a new item
	 */
	var newItem = function(path, body, step) {
		
		var msg, id = step.attr('id');

		if (body.type === 'task') {
			
			if (body.activity === 'task') {
				msg = {
					label: body.label,
					type: 'task',
					workflow: body.workflow,
					source: '',
					ui: body.ui
				};
			}
			else {
				msg = {
					label: body.label,
					type: body.type,
					activity: body.activity,
					workflow: body.workflow,
					ui: body.ui
				};
			}
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
	        	console.log($g.steps);
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
						$(this).css('top', (fb.target.height / 2) + 20);
						$(this).css('left', (fb.target.width / 2) + 20);
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
		if (activity.type === 'start') {
			endpoint = {
				success: $g.conn.success
					};
		}
		else if (activity.type === 'end') {
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
		itemClass = sizeClass + ' item ' + activity.type + 'Item';

		
		// create the html for the step
		var stepHTML = 	'<div id="' + newId +
						'" wfItemLabel="' + step.label +
						'" wfItemType="' + activity.type +
						'" wfItemId="' + step.id +
						'" wfActivity="' + activity.id +
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
		connectItems: connectItems,
		newItem: newItem,
		addItem: addItem,
		addItems: addItems
	};
	
});