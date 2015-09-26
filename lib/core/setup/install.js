/**
 * Install labyrinth
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	// import bookshelf-factory
	var dream   = env.dream;
	var factory = dream.factory;
	
	// return the install function
	return function() {
		// import models and data
		var models  = require('../routes/v0.0.1/models')(env);
		var data    = require('./data');
		
		// prepare the schema
		var schema  = factory.prepareSchema(models) || {};
		
		// create a transaction
		return factory.knex.transaction(function(trx) {
			
			// create the tables
			return factory.schemer.drop(schema, trx).then(function() {
				
				console.log('Dropped Tables');
				
				// create a database
				return factory.schemer.sync(schema, trx).then(function() {
					
					console.log('Created Tables');
					
					return factory.schemer.convertAndLoad(data, schema, trx).then(function() {
						console.log('Loaded Data');
					});
				});
			});
		});
	};
};