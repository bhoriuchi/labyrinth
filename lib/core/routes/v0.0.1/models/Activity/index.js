/**
 * Activity Model
 * @name activity
 * @extends ManagedEntity
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;
	
	return {
        _model: {
        	name: 'activity'
        },
        type: {
        	type: type.string,
        	size: 32,
        	views: ['summary', 'load', 'menu']
        },
        readonly: {
        	type: type.boolean,
        	defaultTo: false
        },
        description: {
        	type: type.text,
        	textType: 'mediumtext',
        	nullable: true
        },
        source: {
        	type: type.text,
        	textType: 'longtext',
        	versioned: true,
        	views: ['edit']
        },
        parameters: {
        	hasMany: 'wf_parameter',
        	nullable: true,
        	versioned: true
        }
    };
};