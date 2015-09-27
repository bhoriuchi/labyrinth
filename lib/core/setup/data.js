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
	parameter: [
	    {
	    	id: 1,
	    	name: 'message',
	    	scope: types.params.input,
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	parameterversion: [
	    {
	    	id: 1,
	    	parent_id: 1,
	    	published: false,
	    	version: 0,
	    	type: types.value.string,
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_activityversion_parameters_id: 'activityversion-log0',
	    	fk_workflowversion_parameters_id: 'workflowversion-log0'
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
	    	fk_activityversion_parameters_id: 'activityversion-log1',
	    	fk_workflowversion_parameters_id: 'workflowversion-log1'
	    }
	],
	activity: [
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
	activityversion: [
	    {
	    	id: 'activityversion-start0',
	    	parent_id: sys.id.startActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log(\'running start\');'
	    },
	    {
	    	id: 'activityversion-start1',
	    	parent_id: sys.id.startActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	source: 'application.remote.console.log(\'running start\');'
	    },
	    {
	    	id: 'activityversion-end0',
	    	parent_id: sys.id.endActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log(\'running end\');'
	    },
	    {
	    	id: 'activityversion-end1',
	    	parent_id: sys.id.endActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	source: 'console.log(\'running end\');'
	    },
	    {
	    	id: 'activityversion-log0',
	    	parent_id: 'activity-log',
	    	published: false,
	    	version: 0,
	    	source: 'console.log(message);'
	    },
	    {
	    	id: 'activityversion-log1',
	    	parent_id: 'activity-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	source: 'console.log(message);'
	    }
	],
	workflow: [
	    {
	    	id: 'workflow-log',
	    	name: 'Log to console',
	    	description: 'Logs a message to the console',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	workflowversion: [
	    {
	    	id: 'workflowversion-log0',
	    	parent_id: 'workflow-log',
	    	published: false,
	    	version: 0,
	    },
	    {
	    	id: 'workflowversion-log1',
	    	parent_id: 'workflow-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 0
	    }
	],
	step: [
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
	stepversion: [
	    {
	    	id: 1,
	    	parent_id: 1,
	    	published: false,
	    	version: 0,
	    	label: 'Start',
	    	success: 2,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-start0',
	    	fk_workflowversion_steps_id: 'workflowversion-log0'
	    },
	    {
	    	id: 2,
	    	parent_id: 1,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'Start',
	    	success: 2,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-start1',
	    	fk_workflowversion_steps_id: 'workflowversion-log1'
	    },
	    {
	    	id: 3,
	    	parent_id: 2,
	    	published: false,
	    	version: 0,
	    	label: 'Log',
	    	success: 3,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-log0',
	    	fk_workflowversion_steps_id: 'workflowversion-log0'
	    },
	    {
	    	id: 4,
	    	parent_id: 2,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'Log',
	    	success: 3,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-log1',
	    	fk_workflowversion_steps_id: 'workflowversion-log1'
	    },
	    {
	    	id: 5,
	    	parent_id: 3,
	    	published: false,
	    	version: 0,
	    	label: 'End',
	    	success: 3,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-end0',
	    	fk_workflowversion_steps_id: 'workflowversion-log0'
	    },
	    {
	    	id: 6,
	    	parent_id: 3,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'End',
	    	success: 3,
	    	fail: 3,
	    	exception: 3,
	    	fk_activityversion_activity_id: 'activityversion-end1',
	    	fk_workflowversion_steps_id: 'workflowversion-log1'
	    }
	]
};