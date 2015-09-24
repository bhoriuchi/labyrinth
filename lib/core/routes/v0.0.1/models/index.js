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
		parameter:     extend(ManagedObject, require('./Parameter')(env)),
		parameterexec: extend(ManagedObject, require('./ParameterExec')(env)),
		step:          extend(ManagedEntity, require('./Step')(env)),
		stepexec:      extend(ManagedEntity, require('./StepExec')(env)),
		workflow:      extend(ManagedEntity, require('./Workflow')(env)),
		workflowexec:  extend(ManagedEntity, require('./WorkflowExec')(env))
	};
};
