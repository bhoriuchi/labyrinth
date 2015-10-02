/**
 * ManagedObject Model
 * @name ManagedObject
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;
	
	return {
        id: {
            type: type.uuid,
            increments: true,
            primary: true,
            views: ['summary']
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