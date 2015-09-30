/**
 * Step  Run Model
 * @name steprun
 * @extends ManagedObject
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;
	
	return {
        _model: {
        	name: 'steprun'
        },
		workflow: {
			belongsTo: 'wf_workflowrun'
		},
		step: {
	        belongsTo: 'wf_step'
		},
        started: {
        	type: type.bigInteger
        },
        completed: {
        	type: type.bigInteger,
        	nullable: true
        },
        durationSeconds: {
        	type: type.float,
        	nullable: true
        },
        status: {
        	type: type.string,
        	size: 32
        }
    };
};