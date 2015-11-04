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
	var _SYS      = mods.statics.system;
	
	// create the routes
	var schemas   = require('./core/routes')(mods);
	var routes    = dreamcatcher.getRoutes(schemas);
	
	// add event listeners
	dreamcatcher.register.event({
		event:    _SYS.events.nextStep,
		listener: mods.workflow.next
	});
	
	// add socket.io listener for connection
	dreamcatcher.register.socket({
		event:    mods.statics.system.sockets.connection,
		listener: function(socket) {

			// join a room
			socket.on(_SYS.sockets.message, function(msg) {
				
				// handle join message
				if (msg.type === _SYS.sockets.join) {
					socket.join(msg.id);
					socket.emit(_SYS.sockets.message, {
						type: _SYS.sockets.start,
						id: msg.id
					});
				}
				else if (msg.type === _SYS.sockets.leave) {
					socket.leave(msg.id);
				}
			});
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