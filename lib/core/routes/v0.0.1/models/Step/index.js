/**
 * Step Model
 * @name step
 * @extends ManagedEntity
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.mods.dream.schemer.constants.type;
	
	return {
		workflow: {
			belongsTo: 'workflow'
		},
		activity: {
	        type: type.string,
	        size: 255,
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
        }
    };
};