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
	wf_datatype: [
	    {
	    	id: 'datatype-string',
	    	name: 'string',
	    	description: 'a string value',
	    	source: 'return String(value);'
	    },
	    {
	    	id: 'datatype-number',
	    	name: 'number',
	    	description: 'a number value',
	    	source: 'return Number(value);'
	    },
	    {
	    	id: 'datatype-boolean',
	    	name: 'boolean',
	    	description: 'a boolean value',
	    	source: 'return Boolean(value);'
	    },
	    {
	    	id: 'datatype-object',
	    	name: 'object',
	    	description: 'an object in JSON format',
	    	source: 'return JSON.parse(value);'
	    },
	    {
	    	id: 'datatype-array',
	    	name: 'array',
	    	description: 'an array',
	    	source: 'return JSON.parse(value);'
	    },
	    {
	    	id: 'datatype-date',
	    	name: 'date',
	    	description: 'a date object',
	    	source: 'return new Date(value);'
	    }
	],
	wf_parameter: [
	    {
	    	id: 1,
	    	scope: 'activity',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 2,
	    	scope: 'workflow',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 3,
	    	scope: 'step',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: 4,
	    	scope: 'step',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    
	],
	wf_parameterver: [
	    {
	    	id: 1,
	    	parent_id: 1,
	    	published: false,
	    	version: 0,
	    	name: 'message',
	    	type: 'input',
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_activityver_parameters_id: 'activityver-log0',
	    	//fk_wf_workflowver_parameters_id: 'workflowver-log0'
	    },
	    {
	    	id: 2,
	    	parent_id: 1,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	name: 'message',
	    	type: 'input',
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_activityver_parameters_id: 'activityver-log1',
	    	//fk_wf_workflowver_parameters_id: 'workflowver-log1'
	    },
	    {
	    	id: 3,
	    	parent_id: 2,
	    	published: false,
	    	version: 0,
	    	name: 'log',
	    	type: 'attribute',
	    	required: true,
	    	defaultValue: '',
	    	description: 'Log to set',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	//fk_wf_activityver_parameters_id: 'activityver-log0',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log0'
	    },
	    {
	    	id: 4,
	    	parent_id: 2,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	name: 'log',
	    	type: 'attribute',
	    	required: true,
	    	defaultValue: '',
	    	description: 'Log to set',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	// fk_wf_activityver_parameters_id: 'activityver-log1',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log1'
	    },
	    {
	    	id: 5,
	    	parent_id: 3,
	    	published: false,
	    	version: 0,
	    	name: 'bool',
	    	type: 'input',
	    	mapAttribute: 2,
	    	required: true,
	    	defaultValue: '',
	    	description: 'boolean decision',
	    	//fk_wf_activityver_parameters_id: 'activityver-log0',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_stepver_parameters_id: '7',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log0'
	    },
	    {
	    	id: 6,
	    	parent_id: 3,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	name: 'bool',
	    	type: 'input',
	    	mapAttribute: 2,
	    	required: true,
	    	defaultValue: '',
	    	description: 'boolean decision',
	    	//fk_wf_activityver_parameters_id: 'activityver-log1',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_stepver_parameters_id: '8',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log1'
	    },
	    {
	    	id: 7,
	    	parent_id: 4,
	    	published: false,
	    	version: 0,
	    	name: 'message',
	    	type: 'input',
	    	mapAttribute: 2,
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_stepver_parameters_id: '3',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log0'
	    },
	    {
	    	id: 8,
	    	parent_id: 4,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	name: 'message',
	    	type: 'input',
	    	mapAttribute: 2,
	    	required: true,
	    	defaultValue: '',
	    	description: 'Message to print to the console',
	    	fk_wf_datatype_dataType_id: 'datatype-string',
	    	fk_wf_stepver_parameters_id: '4',
	    	fk_wf_workflowver_parameters_id: 'workflowver-log1'
	    },
	],
	wf_activity: [
	    {
	    	id: sys.id.startActivity,
	    	name: 'Start',
	    	type: types.activity.start,
	    	readonly: true,
	    	description: 'Starting point of a Workflow',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    },
	    {
	    	id: sys.id.endActivity,
	    	name: 'End',
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
	    	readonly: false,
	    	description: 'Log a message to the console',
	    	active: true,
	    	use_current: true,
	    	current_version: 1
	    }
	],
	wf_activityver: [
	    {
	    	id: 'activityver-start0',
	    	parent_id: sys.id.startActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log((new Date()).toISOString(),\' - STARTING\');'
	    },
	    {
	    	id: 'activityver-start1',
	    	parent_id: sys.id.startActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log((new Date()).toISOString(),\' - STARTING\');'
	    },
	    {
	    	id: 'activityver-end0',
	    	parent_id: sys.id.endActivity,
	    	published: false,
	    	version: 0,
	    	source: 'console.log((new Date()).toISOString(),\' - ENDING\');'
	    },
	    {
	    	id: 'activityver-end1',
	    	parent_id: sys.id.endActivity,
	    	published: true,
	    	version: 1,
	    	valid_from: 1,
	    	source: 'console.log((new Date()).toISOString(),\' - ENDING\');'
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
	    	source: 'var x  = [1,1,2,3,4,2];\nx = _modules.lodash.uniq(x);\nconsole.log((new Date()).toISOString(),\' - LOG VERSION 1 - \', message, x);'
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
	    	ui: '{"position":{"top":-5000,"left":-5000}}'
	    },
	    {
	    	id: 'workflowver-log1',
	    	parent_id: 'workflow-log',
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	ui: '{"position":{"top":-5000,"left":-5000}}'
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
	    },
	    {
	    	id: 4,
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
	    	type: types.activity.start,
	    	success: 4,
	    	ui: '{"position":{"top":5100,"left":5035}}',
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
	    	type: types.activity.start,
	    	success: 4,
	    	ui: '{"position":{"top":5100,"left":5035}}',
	    	fk_wf_activityver_activity_id: 'activityver-start1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    },
	    {
	    	id: 3,
	    	parent_id: 2,
	    	published: false,
	    	version: 0,
	    	label: 'Log a message to the console from user input',
	    	type: types.activity.task,
	    	success: 3,
	    	timeout: 3000,
	    	source: 'console.log((new Date()).toISOString(), \' - LOG DRAFT - \', message);',
	    	ui: '{"position":{"top":5100,"left":5282}}',
	    	fk_wf_activityver_activity_id: 'activityver-log0',
	    	fk_wf_workflowver_steps_id: 'workflowver-log0'
	    },
	    {
	    	id: 4,
	    	parent_id: 2,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'Log a message to the console from user input',
	    	type: types.activity.task,
	    	success: 3,
	    	waitOnSuccess: true,
	    	requireKey: true,
	    	ui: '{"position":{"top":5100,"left":5282}}',
	    	source: 'console.log((new Date()).toISOString(), \' - LOG DRAFT - \', message);',
	    	fk_wf_activityver_activity_id: 'activityver-log1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    },
	    {
	    	id: 5,
	    	parent_id: 3,
	    	published: false,
	    	version: 0,
	    	label: 'End',
	    	type: types.activity.end,
	    	success: 3,
	    	ui: '{"position":{"top":5239,"left":5445}}',
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
	    	type: types.activity.end,
	    	success: 3,
	    	ui: '{"position":{"top":5239,"left":5445}}',
	    	fk_wf_activityver_activity_id: 'activityver-end1',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    },
	    {
	    	id: 7,
	    	parent_id: 4,
	    	published: false,
	    	version: 0,
	    	label: 'To Console?',
	    	type: types.activity.condition,
	    	success: 2,
	    	fail: 3,
	    	source: 'if (!bool) {throw \'false\';}',
	    	ui: '{"position":{"top":5100,"left":5148}}',
	    	fk_wf_workflowver_steps_id: 'workflowver-log0'
	    },
	    {
	    	id: 8,
	    	parent_id: 4,
	    	published: true,
	    	version: 1,
	    	valid_from: 0,
	    	label: 'To Console?',
	    	type: types.activity.condition,
	    	success: 2,
	    	fail: 3,
	    	source: 'if (!bool) {throw \'false\';}',
	    	ui: '{"position":{"top":5100,"left":5148}}',
	    	fk_wf_workflowver_steps_id: 'workflowver-log1'
	    }
	]
};