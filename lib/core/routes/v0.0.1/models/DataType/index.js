/**
 * Data Type Model
 * @name datatype
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
        	name: 'datatype'
        },
		name: {
        	type: type.string,
        	size: 255
		},
		description: {
			type: type.string,
			size: 255
		},
        source: {
        	type: type.text,
        	textType: 'longtext'
        }
    };
};