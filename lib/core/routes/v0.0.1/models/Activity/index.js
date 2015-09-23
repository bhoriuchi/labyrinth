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
	
	var type = env.mods.dream.schemer.constants.type;
	
	return {
        type: {
        	type: type.string,
        	size: 32
        },
        description: {
        	type: type.text,
        	textType: 'mediumtext',
        	nullable: true
        },
        source: {
        	type: type.text,
        	textType: 'longtext',
        	versioned: true
        }
    };
};