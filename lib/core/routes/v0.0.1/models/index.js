/**
 * Models Module
 * @module core/routes/v0.0.1/models
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function(env) {
	
	
	// modules
	var _ = env.mods.dream.mods.lodash;
	
	
	// function to emulate extending a class
	var extend = env.mods.dream.factory.schemer.util.extend;

	
	// base objects
	var ManagedObject           = require('./ManagedObject')(env);
	var ExtensibleManagedObject = require('./ExtensibleManagedObject')(env);
	var ManagedEntity           = extend(ExtensibleManagedObject, require('./ManagedEntity')(env));
	
	
	// import models and return them
	return {
		activity:           extend(ManagedEntity, require('./Activity')(env)),
	};
};
