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
		workflow:   'workflow',
		script:     'script'
	},
	params: {
		attribute:  'attribute',
		input:      'input',
		output:     'output'
	},
	scope: {
		workflow:   'workflow',
		activity:   'activity',
		step:       'step'
	},
	status: {
		running:    'running',
		completed:  'completed',
		fail:       'fail',
		exception:  'exception',
		queued:     'queued',
		success:    'success',
		waiting:    'waiting'
	},
	value: {
		string:     'string'
	}
};