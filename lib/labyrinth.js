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

	config.rest = config.rest || {};
	config.rest.server = config.rest.server || {};
	config.rest.server.name = config.rest.server.name || 'LABYRINTH';
	
	// import dreamcatcher
	var dream   = require('dreamcatcher')(config);
	var schemas = require('./core/routes')({schemer: dream.mods.schemer});
	var routes  = dream.getRoutes(schemas);
	
	// push a route to the basic UI
	routes.push(dream.staticRoute({
		path: /\/public\/?.*/,
		directory: __dirname.replace('/lib', ''),
		'default': 'index.html'
	}));
	
	console.log(__dirname);
	
	// create a modules object
	var mods = {
		dream:   dream,
		statics: require('./core/statics'),
		routes: routes,
		run: dream.run
	};
	
	return mods;
	
};