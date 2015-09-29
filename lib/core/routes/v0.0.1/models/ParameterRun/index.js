/**
 * Parameter Run Model
 * @name parameterrun
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
        	name: 'parameterrun'
        },
		parameter: {
			belongsTo: 'wf_parameter'
		},
        value: {
        	type: type.string,
        	size: 255,
        	nullable: true
        }
    };
};