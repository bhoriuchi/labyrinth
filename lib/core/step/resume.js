/**
 * Resume a step that executed a subworkflow
 * 
 * @name resume
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
		return function(id, status, fetchOpts) {

			var nextStep;
			
			// get the models
			var models = factory.models(version);
			
			// create a new transaction
			return factory.transaction(function(t) {
				return models.wf_steprun.forge()
				.transaction(t)
				.view(['started', 'workflow.id', 'workflow.started', 'step.waitOnSuccess', 'step.success', 'step.fail', 'step.exception'])
				.getResource(id, _.cloneDeep(fetchOpts))
				.end()
				.then(function(run) {
					
					// get the time
					return factory.time({transacting: t}).then(function(time) {
						
						// calculate the run duration
						var duration = time - run.started;
						duration = (duration <= 0) ? 0 : duration / 1000.0;
						
						
						// build a message to update the step
						var msg = {
							id: id
						};
						
						// determine the next step
						if (status === types.status.fail) {
							nextStep = run.step.fail;
						}
						else if (status === types.status.exception) {
							nextStep = run.step.exception;
						}
						else {
							nextStep = run.step.success;
							status   = run.step.waitOnSuccess ? types.status.waiting : types.status.success;
						}

						// set the status
						msg.status = status;
						
						if (status !== types.status.waiting) {
							msg.completed = time;
							msg.duration  = duration;
						}

						return models.wf_steprun.forge()
						.transaction(t)
						.saveResource(msg, {idResponse: true})
						.end()
						.then(function() {
							
							// if not waiting, resume the step
							if (status !== types.status.waiting) {
								env.dream.emitter.emit(_SYS.events.nextStep, {
									id:        run.workflow.id,
									nextStep:  nextStep,
									version:   fetchOpts.version,
									override:  fetchOpts.override
								});
							}
						});
					});
				});
			});
		};
	};
};