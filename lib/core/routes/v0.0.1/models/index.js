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
		wf_activity:      extend(ManagedEntity, require('./Activity')(env)),
		wf_module:        extend(ManagedObject, require('./Module')(env)),
		wf_parameter:     extend(ManagedObject, require('./Parameter')(env)),
		wf_parameterrun:  extend(ManagedObject, require('./ParameterRun')(env)),
		wf_step:          extend(ManagedObject, require('./Step')(env)),
		wf_steprun:       extend(ManagedObject, require('./StepRun')(env)),
		wf_workflow:      extend(ManagedEntity, require('./Workflow')(env)),
		wf_workflowrun:   extend(ManagedObject, require('./WorkflowRun')(env))
	};
};
