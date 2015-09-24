/**
 * Workflow Execution Model
 * @name workflowexec
 * @extends ManagedEntity
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
		parameters: {
			hasMany: 'parameterexec',
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
        	hasOne: 'stepexec'
        },
        status: {
        	type: type.string,
        	size: 32
        }
    };
};