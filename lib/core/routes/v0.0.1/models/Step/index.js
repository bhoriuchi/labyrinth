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
			versioned: true
		},
        type: {
        	type: type.string,
        	size: 32,
        	versioned: true
        },
		activity: {
	        belongsTo: 'wf_activity',
	        nullable: true,
	        versioned: true
		},
		subWorkflow: {
			belongsTo: 'wf_workflow',
			nullable: true,
			versioned: true
		},
		timeout: {
			type: type.bigInteger,
			defaultTo: 300000,
			versioned: true
		},
		failsWorkflow: {
			type: type.boolean,
			defaultTo: true
		},
		waitOnSuccess: {
			type: type.boolean,
			defaultTo: false,
			versioned: true
		},
		requireKey: {
			type: type.boolean,
			defaultTo: false,
			versioned: true
		},
        success: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true
        },
        fail: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true
        },
        exception: {
        	type: type.string,
        	size: 255,
        	nullable: true,
        	versioned: true
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
        	versioned: true
        },
        parameters: {
        	hasMany: 'wf_parameter',
        	nullable: true,
        	versioned: true
        },
        modules: {
        	belongsToMany: 'wf_module',
        	nullable: true,
        	versioned: true
        },
		ui: {
			type: type.string,
			nullable: true,
			versioned: true
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