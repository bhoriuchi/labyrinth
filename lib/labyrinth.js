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

	var _ = require('lodash');
	
	// set up variables for modules that can be passed in the config
	var knex, bookshelf, schemer, factory;
	
	
	// validate the configuration is an object
	if (typeof (config) !== 'object') {
		return null;
	}
	
	
	// check for knex instance
	if (_.has(config, 'knex')) {
		knex = config.knex;
	}
	
	
	// if no knex, check for bookshelf
	else if (_.has(config, 'bookshelf')) {
		knex = config.bookshelf.knex;
	}
	
	
	// if no knex or bookshelf, check for bookshelf-factory
	else if (_.has(config, 'factory')) {
		knex = config.factory.knex;
	}
	
	
	// if no bookshelf, check for a db config
	else if (_.has(config, 'client') && _.has(config, 'connection')) {
		var debug = _.has(config, 'debug') ? config.debug : false;
		knex = require('knex')({
			client: config.client,
			connection: config.connection,
			debug: debug
		});
	}
	
	
	// if no knex or bookshelf or db config, return null
	else {
		console.log('Error: Could not find knex, bookshelf, bookshelf-factory, or database config object');
		return null;
	}
	
	
	// import dreamcatcher
	var dream = require('dreamcatcher')({knex: knex});
	
	// create a modules object
	var mods = {
		dream:   dream,
		statics: require('./statics')
	};
	
	
};