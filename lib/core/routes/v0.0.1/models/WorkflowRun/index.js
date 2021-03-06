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
			views: ['run', 'next']
		},
		override: {
			type: type.text,
			nullable: true,
			views: ['run', 'next']
		},
		parameters: {
			hasMany: 'wf_parameterrun',
			nullable: true,
			views: ['next']
		},
        started: {
        	type: type.bigInteger,
			views: ['run', 'next', 'resume']
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
        	views: ['next', 'resume']
        },
        status: {
        	type: type.string,
        	size: 32,
			views: ['run']
        },
        key: {
        	type: type.string,
        	size: 100,
			views: ['run', 'resume']
        },
        parentStep: {
        	type: type.string,
        	nullable: true,
        	views: ['next', 'run', 'resume']
        },
        parentRun: {
        	type: type.string,
        	nullable: true,
        	views: ['next', 'run', 'resume']
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