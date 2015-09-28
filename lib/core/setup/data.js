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
	module: [
	    {
	    	id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea',
	    	name: 'console'
	    },
	    {
	    	id: 'daefc142-662a-11e5-bed1-c5d3d3a6c5ea',
	    	name: 'lodash'
	    }
	],
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
	junction_modules_activityversion_module: [
	    {activityversion_id: 'activityversion-start0', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-start1', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-end0', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-end1', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-log0', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-log1', module_id: '54fe1830-6621-11e5-bed1-c5d3d3a6c5ea'},
	    {activityversion_id: 'activityversion-log1', module_id: 'daefc142-662a-11e5-bed1-c5d3d3a6c5ea'}
	],
	activityversion: [
	    {
	    	id: 'activityversion-start0',
	    	parent_id: sys.id.startActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log(\'running start v0\');'
	    },
	    {
	    	id: 'activityversion-start1',
	    	parent_id: sys.id.startActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log(\'running start v1\');'
	    },
	    {
	    	id: 'activityversion-end0',
	    	parent_id: sys.id.endActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log(\'running end v0\');'
	    },
	    {
	    	id: 'activityversion-end1',
	    	parent_id: sys.id.endActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log(\'running end v1\');'
	    },
	    {
	    	id: 'activityversion-log0',
	    	parent_id: 'activity-log',
	    	published: false,
	    	version: 0,
	    	source: 'console.log(message, \'v0\');while(true){};'
	    },
	    {
	    	id: 'activityversion-log1',
	    	parent_id: 'activity-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'var x  = [1,1,2,3,4,2];x = _modules.lodash.uniq(x); console.log(message, \'v1\', x);'
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
	    	fk_activityversion_activity_id: 'activityversion-end1',
	    	fk_workflowversion_steps_id: 'workflowversion-log1'
	    }
	]
};