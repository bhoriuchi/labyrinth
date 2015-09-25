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
		label: {
			type: type.string,
			size: 255,
			versioned: true
		},
		activity: {
	        belongsTo: 'activity',
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
			belongsTo: 'workflow',
			connectRelation: 'steps'
		}
    };
};