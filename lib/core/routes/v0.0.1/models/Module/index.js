/**
 * Module Model
 * @name module
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
        	name: 'module'
        },
		name: {
			type: type.string,
			size: 255
		}
    };
};