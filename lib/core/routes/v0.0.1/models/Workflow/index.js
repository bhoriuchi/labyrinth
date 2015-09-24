/**
 * Workflow Model
 * @name workflow
 * @extends ManagedEntity
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;
	
	return {
        description: {
        	type: type.text,
        	textType: 'mediumtext',
        	nullable: true
        },
        parameters: {
        	hasMany: 'parameter',
        	nullable: true,
        	versioned: true
        },
        steps: {
        	hasMany: 'step',
        	connectRelation: 'workflow',
        	versioned: true
        }
    };
};