/**
 * Executes a step
 * @name exec
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// set the entire context
	function set(context) {
		env.context = context;
		env.context.console = console;
	}
	
	// add a new item to the context
	function add(name, value) {
		env.context[name] = value;
	}
	
	// remove an item from the context
	function remove(name) {
		delete env.context[name];
	}
	
	// clear the context
	function clear() {
		env.context = {};
	}
	
	// return the functions
	return {
		set: set,
		add: add,
		remove: remove,
		clear: clear
	};
};