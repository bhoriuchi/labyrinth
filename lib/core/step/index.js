/**
 * Step module
 * @module core/step
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	return {
		create:  require('./create')(env)({version: '0.0.1'})
	};
};
