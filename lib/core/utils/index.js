/**
 * Utils module
 * @module core/utils
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	return {
		util:  require('./util')(env)
	};
};
