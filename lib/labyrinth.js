/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * @version 0.1.11
 * 
 * @description
 * Design, create, and update a relational database schema using JSON
 * 
 * @module knex-schemer
 * @param {knex} knex - An instance of knex.
 * @returns {Object}
 */
module.exports = function(config) {

	config.rest  = config.rest || {};
	config.rest.server = config.rest.server || {};
	config.rest.server.name = config.rest.server.name || '☀ LABYRINTH ☀';
	
	// import dreamcatcher
	var dream    = require('dreamcatcher')(config);
	
	// create a modules object
	var mods     = {
		dream: dream,
		schemer: dream.mods.schemer,
		statics: require('./core/statics')
	};
	
	// import the workflow module
	mods.workflow = require('./core/workflow')(mods);
	var setup     = require('./core/setup')(mods);
	
	var schemas  = require('./core/routes')(mods);
	var routes   = dream.getRoutes(schemas);
	
	// push a route to the basic UI
	routes.push(dream.staticRoute({
		path: /\/public\/?.*/,
		directory: __dirname.replace('/lib', ''),
		'default': 'index.html'
	}));
	
	// create a modules object
	var labyrinth = {
		dream:   dream,
		statics: mods.statics,
		routes: routes,
		run: dream.run,
		setup: setup
	};
	
	return labyrinth;
	
};