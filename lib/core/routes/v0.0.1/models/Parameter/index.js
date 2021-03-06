/**
 * Parameter Model
 * @name parameter
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
        	name: 'parameter'
        },
		name: {
			type: type.string,
			size: 64,
			versioned: true,
			views: ['load', 'edit', 'run', 'next', 'output']
		},
		type: {
			type: type.string,
			size: 64,
			versioned: true,
			views: ['load', 'edit', 'run', 'next', 'output']
		},
		dataType: {
			belongsTo: 'wf_datatype',
			versioned: true,
			views: ['load', 'edit', 'next', 'output']
		},
		scope: {
			type: type.string,
			size: 32,
			protect: true,
			views: ['load', 'edit', 'run']
		},
		required: {
			type: type.boolean,
			defaultTo: false,
			versioned: true,
			views: ['load', 'edit', 'run', 'next']
		},
		mapAttribute: {
			type: type.string,
			nullable: true,
			versioned: true,
			views: ['load', 'edit', 'run', 'next', 'output']
		},
		defaultValue: {
			type: type.text,
			textType: 'longtext',
			nullable: true,
			versioned: true,
			views: ['load', 'edit', 'run', 'next']
		},
        description: {
        	type: type.text,
        	nullable: true,
        	versioned: true,
        	views: ['load', 'edit']
        },
        replicaOf: {
        	type: type.string,
        	nullable: true
        },
        step: {
        	belongsTo: 'wf_step',
        	nullable: true,
        	versioned: true,
        	connectRelation: 'parameters',
        	views: ['run', 'next']
        },
        workflow: {
        	belongsTo: 'wf_workflow',
        	nullable: true,
        	versioned: true,
        	connectRelation: 'parameters'
        },
        _rest: {
        	methods: {
        		POST: {
        			postUpdate: true
        		}
        	}
        }
    };
};