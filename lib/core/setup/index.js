/**
 * Setup module
 * @module core/setup
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	return {
		install: require('./install')(env)
	};
};
