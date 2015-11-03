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
		create:  require('./create')(env)({version: '0.0.1'}),
		update:  require('./update')(env)({version: '0.0.1'}),
		resume:  require('./resume')(env)({version: '0.0.1'}),
		del   :  require('./del')(env)({version: '0.0.1'})
	};
};
