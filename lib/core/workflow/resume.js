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
	var errors  = env.statics.errorCodes;
	var _SYS    = env.statics.system;
	
	// modules
	var factory = env.dream.factory;
	var util    = factory.utils.util;
	var _       = factory.mods.lodash;
	
	// factory constants
	var _STAT   = factory.statics.httpStatus;
	var _ERR    = factory.statics.errorCodes;
	
	
	return function(opts) {
		
		// default the version to 0.0.1 models
		var version = opts.version || '0.0.1';
		
		
		// return a handler function
		return function(req, res, next) {
			
			var err;
			
			// set default status to successful
			var status  = types.status.success;
			
			// acceptable step status to set
			var stepstat = [
			    types.status.success,
			    types.status.exception,
			    types.status.fail
			];
			
			// get the models
			var models = factory.models(version);

			// create a new transaction
			return factory.transaction(function(t) {
				
				// get the workflow run
				return models.wf_workflowrun.forge()
				.transaction(t)
				.getResource(req.params.id)
				.end()
				.then(function(run) {
					
					// send 404 if not found
					if (!run) {
						res.send(_STAT.NO_CONTENT.code, _STAT.NO_CONTENT);
						return next();
					}
					
					// otherwise validate the run
					if (run.status !== types.status.running) {
						
						// create a new error
						err = util.newErr(
							_STAT.CONFLICT.code,
							'The workflow is not currently in a running state and cannot be resumed',
							errors.INVALID_STATE.code,
							errors.INVALID_STATE.detail
						);
						res.send(err.code, err);
						return next();
					}
					
					// check the step status
					if (!_.has(run, 'currentStep.status') || run.currentStep.status !== types.status.waiting) {
						
						// create a new error
						err = util.newErr(
							_STAT.CONFLICT.code,
							'The current step is not currently in a waiting state or does not exist',
							errors.INVALID_STATE.code,
							errors.INVALID_STATE.detail
						);
						res.send(err.code, err);
						return next();
					}
					
					
					// check if the key needs to be validated, and validate it
					if (run.currentStep.step.requireKey && (!_.has(req, 'body.key') || run.key !== req.body.key)) {
						
						// create a new error
						err = util.newErr(
							_STAT.BAD_REQUEST.code,
							'The resume operation for this workflow run requires a valid run key to be supplied in the form {key: <run_key>}',
							errors.INVALID_KEY.code,
							errors.INVALID_KEY.detail
						);
						res.send(err.code, err);
						return next();
					}
					
					
					// check for a status in the body
					if (_.has(req, 'body.status')) {
						status = req.body.status;
						status = _.contains(stepstat, status) ? status : types.status.success;
						
					}
					
					// update the current step the status
					// if we made it this far, emit a next event
					env.dream.emitter.emit(_SYS.events.nextStep, {
						id:        run.id,
						wfstarted: run.started,
						started:   run.currentStep.started,
						nextStep:  run.currentStep.step[status],
						version:   run.workflowVersion
					});
					
					// get the time
					return factory.time({transacting: t}).then(function(time) {
						
						// calculate how long the activity took in seconds
						var duration = time - run.currentStep.started;
						duration = (duration <= 0) ? 0 : duration / 1000.0;
						
						// update the current step status
						return models.wf_steprun.forge()
						.transaction(t)
						.saveResource({
							id: run.currentStep.id,
							status: status,
							completed: time,
							durationSeconds: duration
						})
						.end()
						.then(function(steprun) {
							
							// finally return an OK status
							res.send(_STAT.OK.code, _STAT.OK);
							return next();
						});
					});
				});
			});
		};
	};
};