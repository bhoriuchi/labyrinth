/**
 * Creates a new step in the workflow
 * 
 * @name create
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// constants
	var types   = env.statics.types;
	var _SYS    = env.statics.system;
	var errors  = env.statics.errorCodes;
	
	// modules
	var factory = env.dream.factory;
	var util    = factory.utils.util;
	var _       = factory.mods.lodash;
	var filter  = factory.mods.dotprune;
	var promise = factory.mods.promise;
	
	// factory constants
	var _STAT   = factory.statics.httpStatus;
	var _ERR    = factory.statics.errorCodes;
	var _VER    = factory.statics.version;
	
	
	return function(opts) {
		
		// default the version to 0.0.1
		var version = opts.version || '0.0.1';
		
		// return the handler function
		return function(req, res, next) {

			var id = req.params.id;
			
			// get the models
			var models = factory.models(version);
			
			// create a new transaction
			return factory.transaction(function(t) {
				
				// first get the workflow step
				return models.wf_step.forge()
				.transaction(t)
				.view(['id', 'success', 'fail', 'exception', 'parameters.id', 'workflow.id'])
				.getResource(id, {version: 0})
				.end()
				.then(function(step) {
					
					if (!step) {
						throw 'step not found';
					}
					
					// get original values
					var repoint   = false;
					var workflow  = step.workflow.id;
					var success   = step.success;
					var fail      = step.fail;
					var exception = step.exception;
					
					// nullify the workflow
					step.workflow = null;
					delete step.success;
					delete step.fail;
					delete step.exception;
					
					// nullify the workflow in the parameters
					_.forEach(step.parameters, function(param, key) {
						step.parameters[key].workflow = null;
					});

					// save the updated workflow and params
					return models.wf_step.forge()
					.transaction(t)
					.saveResource(step, {idResponse: true})
					.end()
					.then(function(res) {
						
						// repoint the connections
						return models.wf_workflow.forge()
						.transaction(t)
						.view(['id', 'steps.id', 'steps.success', 'steps.fail', 'steps.exception'])
						.getResource(workflow, {version: 0})
						.end()
						.then(function(wf) {
							
							if (!wf) {
								throw 'cant find workflow';
							}
							
							// update mappings
							_.forEach(wf.steps, function(step, key) {
								if (step.success === id) {
									wf.steps[key].success = success;
									repoint = true;
								}
								else if (step.fail === id) {
									wf.steps[key].fail = fail;
									repoint = true;
								}
								else if (step.exception === id) {
									wf.steps[key].exception = exception;
									repoint = true;
								}
							});
							
							// check for repoint, otherwise return the result
							if (repoint) {
								return models.wf_workflow.forge()
								.transaction(t)
								.saveResource(wf, {idResponse: true})
								.end()
								.then(function(res) {
									return res;
								});
							}
							else {
								return res;
							}
						});
					});
				});
			})
			.then(function(result) {
				res.send(result);
				return next();
			})
			.caught(function(err) {
				console.log(err);
				throw err;
			});
		};
	};
};