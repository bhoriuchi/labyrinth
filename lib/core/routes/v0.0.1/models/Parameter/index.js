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
			size: 64
		},
		type: {
			type: type.string,
			size: 64,
			versioned: true
		},
		scope: {
			type: type.string,
			size: 32,
			protect: true
		},
		required: {
			type: type.boolean,
			defaultTo: false,
			versioned: true
		},
		setsAttribute: {
			type: type.string,
			nullable: true,
			versioned: true
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