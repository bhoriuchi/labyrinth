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
		parameter: {
			belongsTo: 'parameter'
		},
        value: {
        	type: type.string,
        	size: 255,
        	nullable: true
        }
    };
};