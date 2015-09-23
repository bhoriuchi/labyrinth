/**
 * Routes Module which contains all routes and
 * schema definitions for all versions
 * @module core/routes
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	return [
	    {
	    	schema: require('./v0.0.1')(env),
	    	version: '0.0.1'
	    }
	];
};
