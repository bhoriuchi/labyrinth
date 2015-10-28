/**
 * Step Model
 * @name step
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
        	name: 'step'
        },
		label: {
			type: type.string,
			size: 255,
			versioned: true,
			views: ['load', 'edit']
		},
        type: {
        	type: type.string,
        	size: 32,
        	versioned: true,
        	views: ['load', 'edit', 'next']
        },
		activity: {
	        belongsTo: 'wf_activity',
	        nullable: true,
	        versioned: true,
	        views: ['edit']
		},
		subWorkflow: {
			belongsTo: 'wf_workflow',
			nullable: true,
			versioned: true,
	        views: ['edit', 'next']
		},
		timeout: {
			type: type.bigInteger,
			defaultTo: 300000,
			versioned: true,
	        views: ['edit']
		},
		failsWorkflow: {
			type: type.boolean,
			defaultTo: true,
			versioned: true,
	        views: ['edit']
		},
		waitOnSuccess: {
			type: type.boolean,
			defaultTo: false,
			versioned: true,
	        views: ['edit', 'next']
		},
		requireKey: {
			type: type.boolean,
			defaultTo: false,
			versioned: true,
	        views: ['edit', 'resume']
		},
        success: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true,
        	views: ['load', 'resume']
        },
        fail: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true,
        	views: ['load', 'resume']
        },
        exception: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true,
        	views: ['load', 'resume']
        },
		workflow: {
			belongsTo: 'wf_workflow',
			connectRelation: 'steps',
			nullable: true
		},
        source: {
        	type: type.text,
        	textType: 'longtext',
        	nullable: true,
        	versioned: true,
	        views: ['edit']
        },
        parameters: {
        	hasMany: 'wf_parameter',
        	nullable: true,
        	versioned: true,
	        views: ['load', 'edit', 'output']
        },
		ui: {
			type: type.string,
			nullable: true,
			versioned: true,
			views: ['load']
		},
		_rest: {
			methods: {
				POST: {
					handler: {
						useDefaults: false,
						routes: [
						    {
						    	route: '',
						    	handler: env.step.create
						    }
						]
					}
				}
			}
		}
    };
};