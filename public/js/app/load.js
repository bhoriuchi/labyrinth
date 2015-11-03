/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'wf-ui', 'wf-item', 'wf-canvas', 'wf-util'], function($, $g, $ui, $item, $canvas, $util) {
	
	/**
	 * add new node html to menu
	 */
	var _menuNode = function(node) {
		return 	'<li class="itemList">' +
				'<div class="menuObject" ' +
				'wfItemLabel="' + node.label + '" ' +
				'wfItemType="' + node.type + '" ' +
				'wfActivityId="' + $util.exists(node, 'activityId', '') + '" ' +
				'wfWorkflowId="' + $util.exists(node, 'workflowId', '') + '" ' +
				'wfItemId="">' +
				'<div class="centered item-sm ' + node.type + 'Item"></div>' +
				'<div class="itemListLabel">' + node.label + '</div>' +
				'</div>' +
				'</li>';
	};

	/**
	 * loads the data types
	 */
	var loadDataTypes = function() {
		
        // get the workflows
        $.ajax({
            url : $g.wfpath + '/datatypes?view=load',
            method : 'GET',
            crossDomain : true,
            headers : {
                Accept : 'application/json'
            }
        })
        .done(function(data, status, xhr) {
            $g.dataTypes = data;
        })
        .fail(function(xhr, status, err) {
            console.log('ERROR', err);
        });
	};

	/**
	 * load menu items
	 */
	var loadMenuItems = function(id) {
		
		// condition
		$('#generalObjects').append(_menuNode({
			label: 'Condition',
			type: 'condition'
		}));
		
		// loop
		// TODO add support for loops
		/*
		$('#generalObjects').append(_menuNode({
			label: 'Loop',
			type: 'loop'
		}));
		*/
		
		// new task
		$('#generalObjects').append(_menuNode({
			label: 'Task',
			type: 'task'
		}));

	    // get the activities
	    $.ajax({
	        url : $g.wfpath + '/activitys?view=menu',
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
	            if (a.type === 'task') {
	            	$('#taskObjects').append(_menuNode({
	            		label: a.name,
	            		type: a.type,
	            		activityId: a.id
	            	}));
	            }
	        }
	        
	        
	        // get the workflows
	        $.ajax({
	            url : $g.wfpath + '/workflows?view=menu',
	            method : 'GET',
	            crossDomain : true,
	            headers : {
	                Accept : 'application/json'
	            }
	        })
	        .done(function(data, status, xhr) {
	        	
	        	//console.log(data);
	        	
	            $g.workflows = data;
	            
	            for (var i = 0; i < $g.workflows.length; i++) {
	                var w = $g.workflows[i];
	                
	                // do not allow nesting of workflow in itself due to possible
	                // infinite recursion
	                if (w.id !== id) {
		            	$('#workflowObjects').append(_menuNode({
		            		label: w.name,
		            		type: 'workflow',
		            		workflowId: w.id
		            	}));
	                }
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
	var loadWorkflow = function(id, editing, version, iconSize, gridSize) {
		
		
		// initialize variables
		$g.attributes = [];
		$g.steps      = {};
		$g.diagram.reset();
		$g.iconSize = iconSize || $g.iconSize;
		$g.gridSize = !isNaN(gridSize) ? gridSize : $g.gridSize;
		
		
		$g.loadingModal.dialog('open');
		
		var verDate = (new Date(version)).toISOString();
		version = '?version=' + version;
		version = (editing === false) ? version : '?version=0';
		
		$g.id      = id;
		$g.version = version;
		$g.editing = (editing === true) ? true : false;
		
	    // get the workflow
	    $.ajax({
	        url : $g.wfpath + '/workflows/' + id + version + '&view=load',
	        method : 'GET',
	        crossDomain : true,
	        headers : {
	            Accept : 'application/json'
	        }
	    })
	    .done(function(data, status, xhr) {
	    	
	    	// create the header
	    	var header = $g.editing ? data.name + ' - DRAFT' : data.name + ' - Version ' + data.current_version + ' (' + verDate + ')';
	    	
	    	// set the global workflow
        	$g.wf = data;
        	
    		// set the title
    		$g.header.html(header);
	    	
	        //console.log(data, xhr, status);
	        var oset;
	        try {
	        	oset = JSON.parse($g.wf.ui).position;
	        }
	        catch(err) {
	        	oset = null;
	        }
	        
	        // position the workarea
		    $ui.positionWorkarea(oset);

		    // split up the parameters
	        $.each(data.parameters, function(idx, val) {
	        	if (val.type === 'attribute') {
	        		val.dataTypeId = val.dataType.id;
	        		$g.attributes.push(val);
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
		loadMenuItems: loadMenuItems,
		loadDataTypes: loadDataTypes
	};
	
});