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
			belongsTo: 'wf_workflow',
			views: ['next']
		},
		workflowVersion: {
			type: type.bigInteger,
			views: ['run']
		},
		override: {
			type: type.text,
			nullable: true,
			views: ['run']
		},
		parameters: {
			hasMany: 'wf_parameterrun',
			nullable: true,
			views: ['next']
		},
        started: {
        	type: type.bigInteger,
			views: ['run', 'next']
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
        	nullable: true,
        	views: ['next']
        },
        status: {
        	type: type.string,
        	size: 32,
			views: ['run']
        },
        key: {
        	type: type.string,
        	size: 100,
			views: ['run']
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
        steps: {
        	hasMany: 'wf_steprun',
        	connectRelation: 'workflow'
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