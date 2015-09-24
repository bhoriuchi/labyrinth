/**
 * v0.0.1 Routes Module which contains all of the route/schema definitions
 * @module core/routes/v0.0.1
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	// modules
	var _ = env.schemer.config.lodash;
	
	// merge the routes
	var routes = _.merge(require('./models')(env), require('./services')(env));
	
	
	// return the combined routes
	return routes;
};
