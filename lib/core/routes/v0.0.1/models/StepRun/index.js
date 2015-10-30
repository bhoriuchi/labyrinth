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
        parameters: {
        	hasMany: 'wf_parameterrun',
        	nullable: true,
        	connectRelation: 'step'
        },
		workflow: {
			belongsTo: 'wf_workflowrun',
			connectRelation: 'steps'
		},
		step: {
	        belongsTo: 'wf_step',
	        views: ['next', 'output', 'resume']
		},
        started: {
        	type: type.bigInteger,
	        views: ['resume']
        },
        completed: {
        	type: type.bigInteger,
        	nullable: true
        },
        durationSeconds: {
        	type: type.float,
        	nullable: true
        },
        subWorkflow: {
        	type: type.string,
        	nullable: true
        },
        status: {
        	type: type.string,
        	size: 32,
	        views: ['resume']
        },
        log: {
        	type: type.text,
        	textType: 'longtext',
        	nullable: true
        }
    };
};