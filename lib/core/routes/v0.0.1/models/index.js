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
	var _ = env.schemer.config.lodash;
	
	
	// function to emulate extending a class
	var extend = env.schemer.util.extend;

	
	// base objects
	var ManagedObject           = require('./ManagedObject')(env);
	var ExtensibleManagedObject = require('./ExtensibleManagedObject')(env);
	var ManagedEntity           = extend(ExtensibleManagedObject, require('./ManagedEntity')(env));
	
	
	// import models and return them
	return {
		activity:      extend(ManagedEntity, require('./Activity')(env)),
		module:        extend(ManagedObject, require('./Module')(env)),
		parameter:     extend(ManagedObject, require('./Parameter')(env)),
		parameterrun:  extend(ManagedObject, require('./ParameterRun')(env)),
		step:          extend(ManagedObject, require('./Step')(env)),
		steprun:       extend(ManagedObject, require('./StepRun')(env)),
		workflow:      extend(ManagedEntity, require('./Workflow')(env)),
		workflowrun:   extend(ManagedObject, require('./WorkflowRun')(env))
	};
};
