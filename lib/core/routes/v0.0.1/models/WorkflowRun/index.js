/**
 * Workflow Run Model
 * @name workflowrun
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
			belongsTo: 'workflow'
		},
		workflowVersion: {
			type: type.bigInteger
		},
		parameters: {
			hasMany: 'parameterrun',
			nullable: true
		},
        started: {
        	type: type.bigInteger
        },
        completed: {
        	type: type.bigInteger,
        	nullable: true
        },
        currentStep: {
        	hasOne: 'steprun',
        	nullable: true
        },
        status: {
        	type: type.string,
        	size: 32
        }
    };
};