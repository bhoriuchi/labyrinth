/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-ui', 'wf-item', 'wf-canvas'], function($, $g, $ui, $item, $canvas) {
	
	/**
	 * add new node html to menu
	 */
	var _menuNode = function(node) {
		return 	'<li class="itemList">' +
				'<div class="menuObject" ' +
				'wfItemLabel="' + node.name + '" ' +
				'wfItemType="' + node.type + '" ' +
				'wfActivity="' + node.id + '" ' +
				'wfItemId="">' +
				'<div class="centered item-sm ' + node.type + 'Item"></div>' +
				'<div class="itemListLabel">' + node.name + '</div>' +
				'</div>' +
				'</li>';
	};


	/**
	 * load menu items
	 */
	var loadMenuItems = function() {
		
		// condition
		$('#generalObjects').append(_menuNode({
			id: 'condition',
			name: 'Condition',
			type: 'condition'
		}));
		
		// loop
		$('#generalObjects').append(_menuNode({
			id: 'loop',
			name: 'Loop',
			type: 'loop'
		}));
		
		// new task
		$('#generalObjects').append(_menuNode({
			id: 'task',
			name: 'Task',
			type: 'task'
		}));

	    // get the activities
	    $.ajax({
	        url : $g.wfpath + '/activitys?maxdepth=0',
	        method : 'GET',
	        crossDomain : true,
	        headers : {
	            Accept : 'application/json'
	        }
	    })
	    .done(function(data, status, xhr) {
	        $g.activities = data;
	        
	        for (var i = 0; i < $g.activities.length; i++) {
	            var a = $g.activities[i];
	            if (a.type === 'end') {
	            	$('#generalObjects').append(_menuNode(a));
	            }
	            else if (a.type === 'task') {
	            	$('#taskObjects').append(_menuNode(a));
	            }
	        }
	        
	        
	        // get the workflows
	        $.ajax({
	            url : $g.wfpath + '/workflows?maxdepth=0',
	            method : 'GET',
	            crossDomain : true,
	            headers : {
	                Accept : 'application/json'
	            }
	        })
	        .done(function(data, status, xhr) {
	            $g.workflows = data;
	            
	            for (var i = 0; i < $g.workflows.length; i++) {
	                var w = $g.workflows[i];
	            	$('#workflowObjects').append(_menuNode({
	            		id: w.id,
	            		name: w.name,
	            		type: 'workflow'
	            	}));
	            }
	            
	            // make the menu items draggable
	            $ui.makeMenuDraggable();
	            
	        })
	        .fail(function(xhr, status, err) {
	            console.log('ERROR', err);
	        });
	    })
	    .fail(function(xhr, status, err) {
	        console.log('ERROR', err);
	    });
	};
	
	/**
	 * load the workflow
	 * 
	 */
	var loadWorkflow = function(id) {
		
		$g.loadingModal.dialog('open');
		
		
	    // get the workflow
	    $.ajax({
	        url : $g.wfpath + '/workflows/' + id,
	        method : 'GET',
	        crossDomain : true,
	        headers : {
	            Accept : 'application/json'
	        }
	    })
	    .done(function(data, status, xhr) {
	    	
	    	// set the global workflow
        	$g.wf = data;
	    	
	        console.log(data, xhr, status);
	        var oset;
	        try {
	        	oset = JSON.parse($g.wf.ui);
	        }
	        catch(err) {
	        	oset = null;
	        }
	        
	        // position the workarea
		    $ui.positionWorkarea(oset);
		    
		    console.log($g.workarea.position(), $g.workarea.offset());
	        
		    // split up the parameters
	        $.each(data.parameters, function(idx, val) {
	        	if (val.scope === 'attribute') {
	        		$g.attributes.push(val);
	        	}
	        	else if (val.scope === 'input') {
	        		$g.inputs.push(val);
	        	}
	        	else if (val.scope === 'output') {
	        		$g.outputs.push(val);
	        	}
	        });
	        
	        // wait for jsPlumb to be ready
	        $g.diagram.ready(function() {
	            $item.addItems(data, $g.iconSize);
	            $item.connectItems(data);
	            $canvas.init();
	        });
	    })
	    .fail(function(xhr, status, err) {
	        console.log('FAIL', err);
	    })
	    .always(function() {
	    	$g.loadingModal.dialog('close');
	    	$ui.positionElements();
	    });
	};
	

	
	return {
		loadWorkflow: loadWorkflow,
		loadMenuItems: loadMenuItems
	};
	
});