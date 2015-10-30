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
			belongsTo: 'wf_parameter',
			views: ['next', 'output']
		},
        value: {
        	type: type.text,
        	textType: 'longtext',
        	nullable: true,
			views: ['next']
        },
        step: {
        	belongsTo: 'wf_steprun',
        	nullable: true,
        	connectRelation: 'parameters',
        	views: ['run', 'next']
        }
    };
};