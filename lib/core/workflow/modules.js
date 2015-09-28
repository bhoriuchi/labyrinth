/**
 * Adds allowed modules
 * @name modules
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var _ = env.dream.mods.lodash;
	
	// the usable modules
	function set(modules) {
		if (Array.isArray(modules)) {
			env.modules = _.uniq(modules);
		}
	}
	
	// add a new item to the modules
	function add(mod) {
		env.modules = _.union(env.modules, [mod]);
	}
	
	// remove an item from the modules
	function remove(name) {
		env.modules = _.without(env.modules, name);
	}
	
	// clear the modules
	function clear() {
		env.modules = [];
	}
	
	// returns allowed modules from modules passed
	function allowed(requested) {
		requested = (typeof(requested) === 'string') ? [requested] : requested;
		
		if (!Array.isArray(requested)) {
			return [];
		}
		return _.intersection(env.modules, requested);
	}
	
	// return the functions
	return {
		set: set,
		add: add,
		remove: remove,
		clear: clear,
		allowed: allowed
	};
};