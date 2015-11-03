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
		modules: [],
		schemer: dreamcatcher.mods.schemer,
		statics: require('./core/statics'),
		vm:      require('vm'),
		sbx:     require('sbx'),
		hat:     require('hat')
	};
	
	// import the modules
	mods.utils    = require('./core/utils')(mods);
	mods.step     = require('./core/step')(mods);
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
	
	// add socket.io listener for connection
	dreamcatcher.register.socket({
		event:    mods.statics.system.sockets.connection,
		listener: function(socket) {
			socket.emit(mods.statics.system.sockets.connection, 'Connected!');
		}
	});
	
	// create a labyrinth object
	var labyrinth = {
		mods:    mods,
		routes:  routes,
		setup:   setup,
		modules: mods.workflow.modules
	};
	
	// return labyrinth
	return labyrinth;
};