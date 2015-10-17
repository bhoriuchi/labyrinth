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
        _model: {
        	name: 'workflowrun'
        },
		workflow: {
			belongsTo: 'wf_workflow'
		},
		workflowVersion: {
			type: type.bigInteger
		},
		override: {
			type: type.text,
			nullable: true
		},
		parameters: {
			hasMany: 'wf_parameterrun',
			nullable: true
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
        currentStep: {
        	hasOne: 'wf_steprun',
        	nullable: true
        },
        status: {
        	type: type.string,
        	size: 32
        },
        key: {
        	type: type.string,
        	size: 100
        },
        resumeSuccess: {
        	belongsTo: 'wf_step',
        	nullable: true
        },
        resumeFail: {
        	belongsTo: 'wf_step',
        	nullable: true
        },
        resumeException: {
        	belongsTo: 'wf_step',
        	nullable: true
        },
        _rest: {
        	methods: {
        		POST: {
                    handler: {
                    	useDefaults: true,
                    	routes: [
                    	    {
                    	    	route: '/:id/resume',
                    	    	handler: env.workflow.resume
                    	    }
                    	]
                    }
        		}
        	}
        }
    };
};