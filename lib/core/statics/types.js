/**
 * Type Constants
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = {
	activity: {
		condition:  'condition',
		end:        'end',
		loop:       'loop',
		start:      'start',
		task:       'task',
		workflow:   'workflow'
	},
	params: {
		attribute:  'attribute',
		input:      'input',
		output:     'output'
	},
	scope: {
		workflow:   'workflow',
		activity:   'activity'
	},
	status: {
		running:    'running',
		failed:     'failed',
		exception:  'exception',
		queued:     'queued',
		successful: 'successful',
		waiting:    'waiting'
	},
	value: {
		string:     'string'
	}
};