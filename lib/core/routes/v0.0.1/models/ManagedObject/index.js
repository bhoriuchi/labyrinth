/**
 * ManagedObject Model
 * @name ManagedObject
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.mods.dream.schemer.constants.type;
	
	return {
        id: {
            type: type.integer,
            increments: true,
            primary: true
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