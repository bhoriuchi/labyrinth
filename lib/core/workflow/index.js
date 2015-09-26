/**
 * Workflow module
 * @module core/workflow
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	return {
		run: require('./run')(env)({version: '0.0.1'})
	};
};
