/**
 * Setup Data for labyrinth
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */

var statics = require('../statics/');
var types   = statics.types;
var sys     = statics.system;

module.exports = {
	wf_module: [
	    {
	    	id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea',
	    	name: 'console'
	    },
	    {
	    	id: 'daefc142-662a-11e5-bed1-c5d3d3a6c5ea',
	    	name: 'lodash'
	    }
	],
	wf_parameter: [
	    {
	    	id: 1,
	    	name: 'message',
	    	scope: types.params.input,
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	wf_parameterver: [
	    {
	    	id: 1,
	    	parent_id: 1,
	    	published: false,
	    	version: 0,
	    	type: types.value.string,
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_activityver_parameters_id: 'activityver-log0',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log0'
	    },
	    {
	    	id: 2,
	    	parent_id: 1,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	type: types.value.string,
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_activityver_parameters_id: 'activityver-log1',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log1'
	    }
	],
	wf_activity: [
	    {
	    	id: sys.id.startActivity,
	    	name: types.activity.start,
	    	type: types.activity.start,
	    	readonly: true,
	    	description: 'Starting point of a Workflow',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: sys.id.endActivity,
	    	name: types.activity.end,
	    	type: types.activity.end,
	    	readonly: true,
	    	description: 'Ending point of a Workflow',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 'activity-log',
	    	name: 'Log',
	    	type: types.activity.task,
	    	readonly: true,
	    	description: 'Log a message to the console',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	jn_modules_wf_activityver_wf_module: [
	    {wf_activityver_id: 'activityver-start0', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-start1', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-end0', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-end1', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-log0', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-log1', wf_module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {wf_activityver_id: 'activityver-log1', wf_module_id: 'daefc142-662a-11e5-bed1-c5d3d3a6c5ea'}
	],
	wf_activityver: [
	    {
	    	id: 'activityver-start0',
	    	parent_id: sys.id.startActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log((new Date()).toISOString(),\' - STARTING WORKFLOW DRAFT\');'
	    },
	    {
	    	id: 'activityver-start1',
	    	parent_id: sys.id.startActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log((new Date()).toISOString(),\' - STARTING WORKFLOW VERSION 1\');'
	    },
	    {
	    	id: 'activityver-end0',
	    	parent_id: sys.id.endActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log((new Date()).toISOString(),\' - ENDING WORKFLOW DRAFT\');'
	    },
	    {
	    	id: 'activityver-end1',
	    	parent_id: sys.id.endActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log((new Date()).toISOString(),\' - ENDING WORKFLOW VERSION 1\');'
	    },
	    {
	    	id: 'activityver-log0',
	    	parent_id: 'activity-log',
	    	published: false,
	    	version: 0,
	    	source: 'console.log((new Date()).toISOString(), \' - LOG DRAFT - \', message);'
	    },
	    {
	    	id: 'activityver-log1',
	    	parent_id: 'activity-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'var x  = [1,1,2,3,4,2];x = _modules.lodash.uniq(x); console.log((new Date()).toISOString(),\' - LOG VERSION 1 - \', message, x);'
	    }
	],
	wf_workflow: [
	    {
	    	id: 'workflow-log',
	    	name: 'Log to console',
	    	description: 'Logs a message to the console',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	wf_workflowver: [
	    {
	    	id: 'workflowver-log0',
	    	parent_id: 'workflow-log',
	    	published: false,
	    	version: 0,
	    },
	    {
	    	id: 'workflowver-log1',
	    	parent_id: 'workflow-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 0
	    }
	],
	wf_step: [
	    {
	    	id: 1,
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 2,
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 3,
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	wf_stepver: [
	    {
	    	id: 1,
	    	parent_id: 1,
	    	published: false,
	    	version: 0,
	    	label: 'Start',
	    	success: 2,
	    	fk_wf_activityver_activity_id: 'activityver-start0',
	    	fk_wf_workflowver_steps_id: 'workflowver-log0'
	    },
	    {
	    	id: 2,
	    	parent_id: 1,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'Start',
	    	success: 2,
	    	fk_wf_activityver_activity_id: 'activityver-start1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    },
	    {
	    	id: 3,
	    	parent_id: 2,
	    	published: false,
	    	version: 0,
	    	label: 'Log',
	    	success: 3,
	    	timeout: 3000,
	    	fk_wf_activityver_activity_id: 'activityver-log0',
	    	fk_wf_workflowver_steps_id: 'workflowver-log0'
	    },
	    {
	    	id: 4,
	    	parent_id: 2,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'Log',
	    	success: 3,
	    	waitOnSuccess: true,
	    	requireKey: true,
	    	fk_wf_activityver_activity_id: 'activityver-log1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    },
	    {
	    	id: 5,
	    	parent_id: 3,
	    	published: false,
	    	version: 0,
	    	label: 'End',
	    	success: 3,
	    	fk_wf_activityver_activity_id: 'activityver-end0',
	    	fk_wf_workflowver_steps_id: 'workflowver-log0'
	    },
	    {
	    	id: 6,
	    	parent_id: 3,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'End',
	    	success: 3,
	    	fk_wf_activityver_activity_id: 'activityver-end1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    }
	]
};