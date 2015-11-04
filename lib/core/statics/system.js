/**
 * System Constants
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = {
	id: {
		startActivity: 'activity-start',
		endActivity:    'activity-end'
	},
	events: {
		nextStep: 'EVENT_WORKFLOW_NEXT_STEP'
	},
	sockets: {
		connection: 'connection',
		message: 'workflow_message',
		join: 'join',
		leave: 'leave',
		start: 'start',
		stepStart: 'step_start',
		stepEnd: 'step_end',
		log: 'log',
		end: 'end'
	}
};