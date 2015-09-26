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
		workflow: {
			belongsTo: 'workflowrun'
		},
		step: {
	        belongsTo: 'step'
		},
        started: {
        	type: type.bigInteger
        },
        completed: {
        	type: type.bigInteger,
        	nullable: true
        },
        status: {
        	type: type.string,
        	size: 32
        }
    };
};