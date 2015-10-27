/**
 * Utilities
 * @name util
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// constants
	var types   = env.statics.types;
	var _SYS    = env.statics.system;
	
	// modules
	var factory = env.dream.factory;
	var util    = factory.utils.util;
	var _       = factory.mods.lodash;
	
	// factory constants
	var _STAT   = factory.statics.httpStatus;
	var _ERR    = factory.statics.errorCodes;
	
	
	function stringify(object, type) {
		
		if (type === 'object') {
			try {
				return JSON.stringify(object);
			}
			catch (err) {
				console.log(err);
				return String(object);
			}
		}
		else {
			return String(object);
		}
	}
	
	
	/**
	 * https://github.com/lodash/lodash/issues/855
	 */
	function pluckMany(objects, fields) {
		return _.map(objects, _.partialRight(_.pick, fields));
	}
	
	
	// return the methods
	return {
		pluckMany: pluckMany,
		stringify: stringify
	};
};