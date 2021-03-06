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
		run:     require('./run')(env)({version: '0.0.1'}),
		next:    require('./next')(env)({version: '0.0.1'}),
		exec:    require('./exec')(env)({version: '0.0.1'}),
		resume:  require('./resume')(env)({version: '0.0.1'}),
		end:     require('./end')(env)({version: '0.0.1'}),
		create:  require('./create')(env)({version: '0.0.1'}),
		modules: require('./modules')(env)
	};
};
