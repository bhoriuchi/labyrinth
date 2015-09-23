/**
 * ExtensibleManagedObject Model
 * @name ExtensibleManagedObject
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.mods.dream.schemer.constants.type;
	
	return {
        id: {
            type: type.string,
            compositeId: true,
            primary: true
        },
        ex: {
        	hasMany: 'extensiondata',
        	foreignKey: 'resourceId',
        	nullable: true
        },
        _rest: {
            service: {
                path: '/wf'
            },
            methods: {
                HEAD: {},
                GET: {},
                POST: {},
                PUT: {},
                DELETE: {}
            }
        }
    };
};