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
	
	var type = env.mods.dream.schemer.constants.type;
	
	return {
        description: {
        	type: type.text,
        	textType: 'mediumtext',
        	nullable: true
        },
        steps: {
        	hasMany: 'step'
        }
    };
};