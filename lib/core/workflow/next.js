/**
 * Creates executes the next step in the workflow
 * @name run
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// constants
	var types   = env.statics.types;
	var _SYS    = env.statics.system;
	
	// modules
	var factory = env.dream.factory;
	var util    = factory.utils.util;
	var _       = factory.mods.lodash;
	
	// factory constants
	var _STAT   = factory.statics.httpStatus;
	var _ERR    = factory.statics.errorCodes;
	
	
	return function(opts) {
		
		// default the version to 0.0.1
		var version = opts.version || '0.0.1';
		
		return function(args) {
			
			var startStep, endStep, step, params;
			
			// get the models
			var models = factory.models(version);

			
			// create a new transaction
			return factory.transaction(function(t) {
				
				// get the workflow
				return models.workflowrun.forge()
				.transaction(t)
				.getResource(args.id, {version: args.version})
				.end()
				.then(function(run) {
					
					// validate that there is a result
					if (run) {
						
						// save the parameters
						params = run.parameters;
						
						
						// get the start and end steps
						startStep = _.find(run.workflow.steps, function(step) {
							return step.activity.id === _SYS.id.startActivity;
						});	
						endStep   = _.find(run.workflow.steps, function(step) {
							return step.activity.id === _SYS.id.endActivity;
						});
						
						
						// check if the current step is null
						if (run.currentStep === null) {
							
							// find the start step
							step = startStep;
						}
						else {
							// find the current step
							step = _.find(run.workflow.steps, function(step) {
								return step.id === args.nextStep;
							});
						}
						
						// get the time
						return factory.time({transacting: t}).then(function(timestamp) {
							
							// create an execution for the next step
							return models.steprun.forge()
							.transaction(t)
							.saveResource({
								workflow: args.id,
								step: step.id,
								started: timestamp,
								status: types.status.running,
								current: args.id
							})
							.end()
							.then(function(step) {

								return models.workflowrun.forge()
								.transaction(t)
								.saveResource({
									id: args.id,
									currentStep: step.id,
									status: types.status.running
								})
								.end()
								.then(function(wf) {
									return step;
								});
							});
						});
					}
				});
			})
			.then(function(res) {
				
				// execute the workflow
				env.workflow.exec({
					id:        args.id,
					step:      res.step,
					version:   args.version,
					params:    params,
					startStep: startStep.id,
					endStep:   endStep.id
				});
				
				// return the result
				return res;
			})
			.caught(function(err) {
				console.log(err);
			});
		};
	};
};