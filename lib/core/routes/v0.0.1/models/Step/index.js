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
		activity: {
	        belongsTo: 'wf_activity',
	        versioned: true
		},
		timeout: {
			type: type.bigInteger,
			defaultTo: 300000,
			versioned: true
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
			connectRelation: 'steps'
		}
    };
};