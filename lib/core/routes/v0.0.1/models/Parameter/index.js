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
		name: {
			type: type.string,
			size: 64
		},
		type: {
			type: type.string,
			size: 64,
			versioned: true
		},
		scope: {
			type: type.string,
			size: 32//,
			//protect: true
		},
		defaultValue: {
			type: type.string,
			size: 255,
			nullable: true,
			versioned: true
		},
        description: {
        	type: type.text,
        	nullable: true,
        	versioned: true
        }
    };
};