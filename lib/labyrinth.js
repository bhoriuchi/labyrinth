/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * @version 0.1.0
 * 
 * @description
 * A workflow plugin for dreamcatcher
 * 
 * @module labyrinth
 */
module.exports = function(dreamcatcher) {

	// create a modules object
	var mods     = {
		dream:   dreamcatcher,
		context: {},
		schemer: dreamcatcher.mods.schemer,
		statics: require('./core/statics'),
		vm:      require('vm')
	};
	
	// import the modules
	mods.workflow = require('./core/workflow')(mods);
	var setup     = require('./core/setup')(mods);
	
	// create the routes
	var schemas   = require('./core/routes')(mods);
	var routes    = dreamcatcher.getRoutes(schemas);
	
	// add event listeners
	dreamcatcher.register.event({
		event:    mods.statics.system.events.nextStep,
		listener: mods.workflow.next
	});
	
	// create a labyrinth object
	var labyrinth = {
		mods:    mods,
		routes:  routes,
		setup:   setup,
		context: mods.workflow.context
	};
	
	// return labyrinth
	return labyrinth;
};