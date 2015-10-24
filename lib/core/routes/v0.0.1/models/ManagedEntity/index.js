/**
 * ManagedEntity Model
 * @name ManagedEntity
 * @extends ExtensibleManagedObject
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;
	
	return {
        name: {
            type: type.string,
            size: 255,
            unique: true,
            views: ['*']
        }
    };
};